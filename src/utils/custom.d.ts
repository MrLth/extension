/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-04 18:52:15
 * @LastEditTime: 2020-12-15 17:45:22
 * @Description: file content
 */
declare module '*.module.scss' {
	const classes: { [key: string]: string }
	export default classes
}

declare module 'date-format'
declare module 'javascript-time-ago'
declare module 'javascript-time-ago/locale/zh'
declare module 'javascript-time-ago/locale/en'

declare function log(val: unknown, color?: number | string): void 
