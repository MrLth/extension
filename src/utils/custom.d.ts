/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-04 18:52:15
 * @LastEditTime: 2021-02-21 21:10:53
 * @Description: file content
 */
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'date-format'
declare module 'javascript-time-ago'
declare module 'javascript-time-ago/locale/zh'
declare module 'javascript-time-ago/locale/en'

declare function log(
  val: unknown,
  title?: string,
  color?: number | string
): void

declare module 'config' {
  export const ignoreLog: string[]
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
