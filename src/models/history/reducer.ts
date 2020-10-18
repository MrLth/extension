/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-10-18 14:33:59
 * @Description: file content
 */
import state, { HistorySection } from './state'
export type HistoryState = typeof state

function pushNewSection(
	section: HistorySection,
	state: HistoryState
): Partial<HistoryState> {
	state.historySectionList.push(section)
	return state
}

function updSection(
	sectionSegment: Partial<HistorySection>,
	state: HistoryState
): Partial<HistoryState> {
	let last = state.historySectionList[sectionSegment.index]
	Object.assign(last, sectionSegment)
	if ('height' in sectionSegment) {
		for (
			let i = sectionSegment.index + 1, len = state.historySectionList.length;
			i < len;
			i++
		) {
			const v = state.historySectionList[i]
			v.top = last.top + last.height
			last = v
		}
	}
	return state
}

export default { pushNewSection, updSection }
