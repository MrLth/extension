/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2021-02-22 01:02:23
 * @Description: file content
 */
import historyState, { HistorySection } from './state';

export type HistoryState = typeof historyState

function pushNewSection(
  section: HistorySection,
  state: HistoryState,
): Partial<HistoryState> {
  state.historySectionList.push(section);
  return state;
}

function updSection(
  sectionSegment: Partial<HistorySection>,
  state: HistoryState,
): Partial<HistoryState> {
  let last = state.historySectionList[sectionSegment.index];
  Object.assign(last, sectionSegment);
  if ('height' in sectionSegment) {
    for (
      let i = sectionSegment.index + 1, len = state.historySectionList.length;
      i < len;
      i += 1
    ) {
      const v = state.historySectionList[i];
      v.top = last.top + last.height;
      last = v;
    }
  }
  return state;
}

export default { pushNewSection, updSection };
