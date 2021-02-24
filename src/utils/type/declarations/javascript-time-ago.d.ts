/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-24 12:32:33
 * @LastEditTime: 2021-02-24 13:03:15
 * @Description: file content
 */

declare module 'javascript-time-ago' {
  class TimeAgo {
    constructor(locales: string | string[])

    format(date: Date | number, style?: 'twitter' | string): string

    static addLocale(localeData: Record<string, unknown>): void
  }
  export default TimeAgo
}
declare module 'javascript-time-ago/locale/zh'
