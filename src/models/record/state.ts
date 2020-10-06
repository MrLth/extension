/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-09-01 21:26:41
 * @LastEditTime: 2020-10-06 16:52:28
 * @Description: file content
 */
interface RecordUrl {
	title: string
	url: string
}

export interface Recording {
	urls: RecordUrl[]
	recordTime: Date
}

export default {
	recording: [{ urls: [], recordTime: new Date() }] as Recording[],
}
