import { deboundFixed, readFromLocal, saveToLocal } from 'api'
import recordState, { Recording } from './state'
import { IActionCtxBase as IAC } from 'concent'

export type RecordState = typeof recordState

const LOCAL_KEY = 'record'
let isSaved = true

async function save(_new: null, state: RecordState): void {
	if (isSaved) return
	await saveToLocal(LOCAL_KEY, state)
	isSaved = true
}

interface CloseLabelPayload {
	recordingIndex: number
	labelIndex: number
}
function closeRecord(recordingIndex: number, state: RecordState): RecordState {
	state.recording.splice(recordingIndex, 1)
	// 保存至本地
	isSaved = false
	saveDelay(state)
	// 返回新状态
	return state
}
function closeLabel(
	{ recordingIndex, labelIndex }: CloseLabelPayload,
	state: RecordState,
	ctx: IAC
): RecordState {
	const { recording } = state

	// 记录的标签小于等于1时，直接删除记录
	if (recording[recordingIndex].urls.length > 1) {
		recording[recordingIndex] = { ...recording[recordingIndex] }
		recording[recordingIndex].urls.splice(labelIndex, 1)
		// 保存至本地
		isSaved = false
		saveDelay(state)
	} else {
		ctx.dispatch(closeRecord, recordingIndex)
	}
	// 返回新状态
	return state
}

const saveDelay = deboundFixed((state: RecordState) => {
	save(null, state)
}, 5000)

async function init(): Promise<{ recording: Recording[] }> {
	const local = await readFromLocal<RecordState>(LOCAL_KEY, { format: JSON.parse })
	console.log('local', local)
	return local !== null ? local : { recording: [] }
}

function addRecord(newRecording: Recording, state: RecordState): RecordState {
	// 添加到头部
	state.recording.unshift(newRecording)
	// 保存至本地
	isSaved = false
	saveDelay(state)
	// 返回新状态
	return { recording: state.recording }
}

export default { init, addRecord, save, closeLabel, closeRecord }
