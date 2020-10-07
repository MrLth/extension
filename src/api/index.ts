import { Fn } from './type'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 17:30:01
 * @LastEditTime: 2020-10-04 19:52:23
 * @Description: 整个项目会用到的方法和api
 */
export const isLocal = (hostname: string): boolean =>
	/^((127\.0\.0\.1)|(localhost)|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.((1[6-9])|(2\d)|(3[01]))\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3}))(:\d{0,5})?$/.test(
		hostname
	)

export function throttle(
	fn: (...args: unknown[]) => unknown,
	interval: number
): (...args: unknown[]) => void {
	let lastTime: number = null
	return function (...args: unknown[]): void {
		const nowTime = +new Date()
		if (nowTime - lastTime > interval || !lastTime) {
			fn(...args)
			lastTime = nowTime
		}
	}
}

export function debound(
	fn: (...args: unknown[]) => unknown,
	delay: number
): (...args: unknown[]) => void {
	let timer: number = null
	return function (...args: unknown[]): void {
		clearTimeout(timer)

		timer = setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}

export function deboundFixed(
	fn: (...args: unknown[]) => unknown,
	delay: number,
	maxDelay = delay + 50
): (...args: unknown[]) => void {
	let timer: number = null
	let lastHandleTime = +new Date()
	return function (...args: unknown[]): void {
		clearTimeout(timer)
		const nowTime = +new Date()

		const cb = () => {
			lastHandleTime = nowTime
			fn.apply(this, args)
		}
		if (nowTime - lastHandleTime > maxDelay) {
			cb()
		} else {
			timer = setTimeout(cb, delay)
		}
	}
}

export const moduleClassnames = (
	module: Record<string, string>,
	...para: (string | Record<string, boolean>)[]
): string => {
	const len = para.length - 1
	const lastClassName = para[len]
	const classNames = [] as string[]
	const pushToClassNames = (className: keyof typeof module) => {
		if (typeof className === 'string') classNames.push(className)
	}

	for (let i = 0; i < len; i++) {
		pushToClassNames(module[para[i] as string])
	}

	if (typeof lastClassName === 'string') {
		pushToClassNames(module[lastClassName])
	} else if (typeof lastClassName === 'object' && lastClassName !== null) {
		Object.entries(lastClassName).forEach(([k, v]) => {
			if (v) pushToClassNames(module[k])
		})
	}

	return classNames.join(' ')
}
interface ReadFromLocalCbs {
	format?: Fn
	validate?: Fn
}
export const readFromLocal = (
	key: string,
	{ format, validate }: ReadFromLocalCbs = {}
) => {
	const localInfo = localStorage.getItem(key)
	if (localInfo === null) return false // 未保存

	const formatted = format?.(localInfo) ?? localInfo

	// 有效性验证
	if (validate?.(formatted) === false) return false // 数据失效

	return formatted
}
