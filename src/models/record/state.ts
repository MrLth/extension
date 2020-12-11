/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-09-01 21:26:41
 * @LastEditTime: 2020-12-11 15:27:02
 * @Description: file content
 */
export interface RecordUrl {
	title: string
	url: string
}

export interface Recording {
	urls: RecordUrl[]
	recordTime: Date
}

export default {
	recording: [] as Recording[],
}
