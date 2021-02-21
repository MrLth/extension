/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-12 08:17:18
 * @LastEditTime: 2021-02-22 00:45:07
 * @Description: file content
 */
import { readFromLocal, saveToLocal } from 'utils';
import { debounce } from 'lodash-es';
import { IActionCtxBase as IAC } from 'concent';
import recordState, { Recording } from './state';

export type RecordState = typeof recordState

const LOCAL_KEY = 'record';
let isSaved = true;

async function save(_new: null, state: RecordState): Promise<void> {
  if (isSaved) return;
  await saveToLocal(LOCAL_KEY, state);
  isSaved = true;
}

interface CloseLabelPayload {
  recordingIndex: number
  labelIndex: number
}
function closeRecord(recordingIndex: number, state: RecordState): RecordState {
  state.recording.splice(recordingIndex, 1);
  // 保存至本地
  isSaved = false;
  // saveDelay(state);
  // 返回新状态
  return state;
}
function closeLabel(
  { recordingIndex, labelIndex }: CloseLabelPayload,
  state: RecordState,
  ctx: IAC,
): RecordState {
  const { recording } = state;

  // 记录的标签小于等于1时，直接删除记录
  if (recording[recordingIndex].urls.length > 1) {
    recording[recordingIndex] = { ...recording[recordingIndex] };
    recording[recordingIndex].urls.splice(labelIndex, 1);
    recording[recordingIndex].lastEditTime = new Date();
    // 保存至本地
    isSaved = false;
    // saveDelay(state);
  } else {
    ctx.dispatch(closeRecord, recordingIndex);
  }
  // 返回新状态
  return state;
}

const saveDelay = debounce((state: RecordState) => {
  save(null, state);
}, 5000);

async function init(): Promise<{ recording: Recording[] }> {
  const local = await readFromLocal<RecordState>(LOCAL_KEY, {
    format: JSON.parse,
  });
  return local !== null ? local : { recording: [] };
}

function addRecord(newRecording: Recording, state: RecordState): RecordState {
  // 添加到头部
  state.recording.unshift(newRecording);
  // 保存至本地
  isSaved = false;
  saveDelay(state);
  // 返回新状态
  return { recording: state.recording };
}

function updRecord(newList: Recording[], state: RecordState): RecordState {
  for (const item of newList) {
    const record = {
      ...item,
      recordTime: new Date(item.recordTime),
      lastEditTime: new Date(item.lastEditTime),
    };
    const i = state.recording.findIndex((v) => v.recordTime === record.recordTime);
    if (i === -1) {
      state.recording.unshift(record);
    } else {
      state.recording.splice(i, 1, record);
    }
  }
  // 保存至本地
  isSaved = false;
  saveDelay(state);
  // 返回新状态
  return { recording: state.recording };
}

export default {
  init, addRecord, save, closeLabel, closeRecord, updRecord,
};
