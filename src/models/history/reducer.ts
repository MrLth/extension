/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-10-13 17:39:32
 * @Description: file content
 */
import { DomainHistoryItem } from 'components/History/api'
import state from './state'
export type HistoryState = typeof state

function initHistoryObj(domainHistoryList: DomainHistoryItem[]): HistoryState {
	return { domainHistoryList }
}

export default { initHistoryObj }
