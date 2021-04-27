/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-12 08:17:18
 * @LastEditTime: 2021-04-27 20:18:39
 * @Description: file content
 */
import { debounce, isObject } from 'lodash-es';
import { IActionCtxBase as IAC } from 'concent';
import { Obj } from 'utils/type';
import recordState, { Recording } from './state';

export type RecordState = typeof recordState

const LOCAL_KEY = 'record';
let isSaved = true;

function fixDate(source: unknown): unknown {
  if (source instanceof Date) {
    return source.valueOf()
  }

  if (Array.isArray(source)) {
    return source.map((v) => fixDate(v))
  }

  if (isObject(source)) {
    return Object.entries(source).reduce((acc, [k, v]) => {
      acc[k] = fixDate(v)
      return acc
    }, {} as Obj)
  }

  return source
}

async function save(_new: null, state: RecordState): Promise<void> {
  if (isSaved) return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(fixDate(state)))
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
  const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? null)
  return local ?? { recording: [] };
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
