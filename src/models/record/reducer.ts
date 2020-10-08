import { deboundFixed, readFromLocal, saveToLocal } from 'api'
import recordState, { Recording } from './state'

export type RecordState = typeof recordState

const LOCAL_KEY = 'record'
let isSaved = true

function save(_new: any, state: RecordState) {
	if (isSaved) return
	saveToLocal(LOCAL_KEY, state)
	isSaved = true
}

const saveDelay = deboundFixed((state: RecordState) => {
	save({}, state)
}, 5000)

function init() {
	const local = readFromLocal(LOCAL_KEY, { format: JSON.parse })
	return local !== false ? local : {}
}

function updRecoding(newRecording: Recording, state: RecordState) {
	state.recording.unshift(newRecording)
	isSaved = false
	saveDelay(state)
	return { recording: state.recording }
}

export default { init, updRecoding, save }
