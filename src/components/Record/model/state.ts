/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-09-01 21:26:41
 * @LastEditTime: 2021-02-22 00:44:05
 * @Description: file content
 */
export interface RecordUrl {
  title: string
  url: string
}

export interface Recording {
  urls: RecordUrl[]
  recordTime: Date
  lastEditTime?: Date
}

export default {
  recording: [] as Recording[],
};
