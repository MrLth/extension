/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-24 12:31:40
 * @LastEditTime: 2021-02-24 12:32:18
 * @Description: file content
 */
declare module 'date-format' {
  function toString(date: Date): string;
  function toString(format: string, date: Date): string;
  export default toString;
}
