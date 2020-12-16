/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-04 18:52:15
 * @LastEditTime: 2020-12-16 11:48:59
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

declare function log(
	val: unknown,
	title?: string,
	color?: number | string
): void
