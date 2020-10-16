/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-10-16 15:50:21
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
	Object.assign(state.historySectionList[sectionSegment.index], sectionSegment)
	return state
}

export default {  pushNewSection, updSection }
