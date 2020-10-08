import Record from 'components/Record'
import { Fn } from './type'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 17:30:01
 * @LastEditTime: 2020-10-04 19:52:23
 * @Description: 整个项目会用到的方法和api
 */

const DATE_LOCAL_PLACEHOLDER = 'TIMESTAMP'

export const type = (obj: any) =>
	typeof obj !== 'object'
		? typeof obj
		: Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()

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
	format?: (...args: unknown[]) => string
	validate?: (...args: unknown[]) => boolean
}
export const readFromLocal = (
	key: string,
	{ format, validate }: ReadFromLocalCbs = {}
) => {
	const fixDateType = (data: any) => {
		if (typeof data === 'string' && data.endsWith(DATE_LOCAL_PLACEHOLDER)) {
			console.log('isDate', data)

			return new Date(parseInt(data))
		}
		if (data === null || typeof data !== 'object') {
			return data
		}

		return Object.entries(data).reduce(
			(acc, [k, v]) => {
				acc[k] = fixDateType(v)
				return acc
			},
			type(data) === 'array' ? [] : ({} as Record<string | number, any>)
		)
	}

	let info = localStorage.getItem(key)
	// 未保存
	if (info === null) return false
	if (typeof format === 'function') {
		info = format(info)
	}
	info = fixDateType(info)
	// 有效性验证
	if (typeof validate === 'function') {
		if (validate(info) === false) return false
	}

	return info
}

export const saveToLocal = (key: string, info: unknown, preTreat?: Fn) => {
	const fixDateType = (data: any) => {
		if (data === null || typeof data !== 'object') {
			return data
		}
		if (type(data) === 'date') return data.valueOf() + DATE_LOCAL_PLACEHOLDER

		return Object.entries(data).reduce(
			(acc, [k, v]) => {
				acc[k] = fixDateType(v)
				return acc
			},
			type(data) === 'array' ? [] : ({} as Record<string | number, any>)
		)
	}
	info = fixDateType(info)

	if (typeof preTreat === 'function') {
		info = preTreat(info)
	}
	localStorage.setItem(key, JSON.stringify(info))
}
