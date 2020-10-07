import { readFromLocal } from 'api'
import recordState, { Recording } from './state'

type RecordState = typeof recordState

const LOCAL_KEY = 'record'

function init() {
	const local = readFromLocal(LOCAL_KEY, { format: JSON.parse })
	return { recording: local !== false ? local : [] }
}

function updRecoding(newRecording: Recording, state: RecordState) {
	state.recording.unshift(newRecording)
	return { recording: state.recording}
}

export default { init, updRecoding }
