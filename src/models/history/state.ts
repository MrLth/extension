import { DomainHistoryItem } from 'components/History/api'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-09-01 21:26:41
 * @LastEditTime: 2020-10-18 11:03:53
 * @Description: file content
 */
export interface HistorySection {
	index: number
	top: number
	height: number
	list: DomainHistoryItem[]
	status: 'loading' | 'completed'
	startTime: number
	endTime: number
}

export default {
	historySectionList: [] as HistorySection[]
}
