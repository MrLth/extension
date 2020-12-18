import { Fn, Keys, Obj } from './type'
import format from 'date-format'
import { Key } from 'react'
import { ignoreLog } from 'config'
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 17:30:01
 * @LastEditTime: 2020-12-18 08:23:54
 * @Description: 整个项目会用到的方法和api
 */

const DATE_LOCAL_PLACEHOLDER = 'TIMESTAMP'

export const type = (obj: unknown): string =>
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
	format?: <T>(...args: unknown[]) => T
	validate?: (...args: unknown[]) => boolean
}
export const readFromLocal = <T>(
	key: string,
	{ format, validate }: ReadFromLocalCbs = {}
): T | Promise<T> => {
	// chrome extension storage 和localStorage都无法存储Date类型
	const fixDateType = (data: unknown) => {
		if (typeof data === 'string' && data.endsWith(DATE_LOCAL_PLACEHOLDER)) {
			return new Date(parseInt(data))
		}
		if (data === null || typeof data !== 'object') {
			return data
		}

		return Object.entries(data).reduce(
			(acc, [k, v]) => {
				acc[k as keyof typeof data] = fixDateType(v)
				return acc
			},
			type(data) === 'array' ? [] : ({} as Record<string | number, unknown>)
		)
	}
	// //#region 优先从chrome extension storage读取
	// if (typeof chrome?.storage?.sync?.get === 'function') {
	// 	return new Promise((resolve) => {
	// 		chrome.storage.sync.get([key], (rst) => {
	// 			resolve(fixDateType(rst[key]) as T)
	// 		})
	// 	})
	// }
	//#endregion
	//#region 无法从chrome extension storage读取时，改为从localStorage读取
	let info: string | T = localStorage.getItem(key)
	// 未保存
	if (info === null) return null
	if (typeof format === 'function') {
		info = format(info)
	}
	info = fixDateType(info) as T
	// 有效性验证
	if (typeof validate === 'function') {
		if (validate(info) === false) return null
	}
	return info
	//#endregion
}

export const saveToLocal = (
	key: string,
	info: unknown,
	preTreat?: Fn
): void | Promise<unknown> => {
	// chrome extension storage 一样无法存储Date类型
	const fixDateType = (data: unknown) => {
		if (data === null || typeof data !== 'object') {
			return data
		}
		if (type(data) === 'date') return data.valueOf() + DATE_LOCAL_PLACEHOLDER

		return Object.entries(data).reduce(
			(acc, [k, v]) => {
				acc[k as keyof typeof data] = fixDateType(v)
				return acc
			},
			type(data) === 'array' ? [] : ({} as Record<string | number, unknown>)
		)
	}
	// //#region 优先存储在chrome extension storage
	// if (typeof chrome?.storage?.sync?.set === 'function') {
	// 	return new Promise((resolve) => {
	// 		chrome.storage.sync.set({ [key]: fixDateType(info) }, resolve)
	// 	})
	// }
	//#endregion
	//#region 无法存储在chrome extension storage时，改为从localStorage存储
	info = fixDateType(info)
	if (typeof preTreat === 'function') {
		info = preTreat(info)
	}
	localStorage.setItem(key, JSON.stringify(info))
	//#endregion
}

export const sortByKey = <T>(key: keyof T, desc = false) => (
	a: T,
	b: T
): number => {
	if (a[key] < b[key]) {
		return desc ? 1 : -1
	}
	if (a[key] > b[key]) {
		return desc ? -1 : 1
	}
	return 0
}

export const queryStrToObj = (str: string): Record<string, string> => {
	if (typeof str !== 'string') return
	const search = str.indexOf('?') !== -1 ? str.split('?')[1] : str

	if (!search) return
	return search.split('&').reduce((sum, cur) => {
		const [k, v] = cur.split('=')
		if (k) sum[k] = v
		return sum
	}, {} as Record<string, string>)
}

interface Debug {
	title: string
	para?: unknown
	multi?: Record<string, unknown>
	color?: number | string
	group?: boolean
	label?: string
}
export function debug({
	color,
	title,
	para,
	multi,
	group = false,
	label = '',
}: Debug): void {
	let borderColor = '#096dd9'
	let bgColor = '#1890ff'
	if (typeof color === 'number' && color > 0 && color < 6) {
		bgColor = ['#52c41a', '#13c2c2', '#2f54eb', '#722ed1', '#eb2f96'][color - 1]
		borderColor = ['#389e0d', '#08979c', '#1d39c4', '#531dab', '#c41d7f'][
			color - 1
		]
	} else if (typeof color === 'string') {
		bgColor = color
	}

	const timeColor = 'color:#595959;font-weight:700;font-size:13px'
	const time = format('hh:mm:ss.SSS', new Date())
	const labelColor =
		label.length > 0
			? `border: 1px solid ${borderColor};font-size:13px;background: ${borderColor}; color: rgb(255, 255, 255);font-weight:100;padding:0 4px`
			: ''
	const titleColor = `border: 1px solid ${borderColor};font-size:13px;background: ${bgColor}; color: rgb(255, 255, 255);font-weight:100`
	const titleText = ' ' + title + ' '
	const border = 'border-left: 1px solid #000;padding:2px 0;margin-left:5.5px'
	const paraColor = 'color:#69c0ff'
	const multiColor = 'color:#5cdbd3'
	const entries = Object.entries(multi ?? {})
	const maxLength = entries.reduce(
		(a, [k]) => (a < k.length ? k.length : a),
		typeof para === 'string' ? para.length : 10
	)
	const paraTitle = 'parameters'

	if (group) {
		console.group(
			'%c %s %c%s%c%s',
			timeColor,
			time,
			labelColor,
			label,
			titleColor,
			titleText
		)
		{
			para &&
				console.log('%c %s  %o', paraColor, paraTitle.padEnd(maxLength, ' '), para)
			if (typeof multi === 'object') {
				for (const [k, v] of Object.entries(multi)) {
					console.log('%c %s  %o', multiColor, k.padEnd(maxLength, ' '), v)
				}
			}
		}
		console.groupEnd()
	} else {
		let pattern = '%s%c %s %c%s%c%s%c'
		const parameters = [
			'🔰',
			timeColor,
			time,
			labelColor,
			label,
			titleColor,
			titleText,
			'',
		]

		if (para) {
			pattern += '%s%c%s%c %s  %o'
			parameters.push(
				'\n',
				border,
				' ',
				paraColor,
				paraTitle.padEnd(maxLength, ' '),
				para
			)
		}

		if (typeof multi === 'object') {
			for (const [k, v] of entries) {
				pattern += '%s%c%s%c %s  %o'
				parameters.push('\n', border, ' ', multiColor, k.padEnd(maxLength, ' '), v)
			}
		}

		console.log(pattern, ...parameters)
	}
}

export function log(
	val: unknown,
	title = 'log',
	color?: number | string
): void {
	// 1. 忽略
	if (ignoreLog.includes(title)) return

	let borderColor = '#b37feb'
	let bgColor = '#d3adf7'

	if (typeof color === 'number' && color > 0 && color < 6) {
		bgColor = ['#52c41a', '#13c2c2', '#2f54eb', '#ff7875', '#eb2f96'][color - 1]
		borderColor = ['#389e0d', '#08979c', '#1d39c4', '#ff4d4f', '#c41d7f'][
			color - 1
		]
	} else if (typeof color === 'string') {
		bgColor = color
	}

	const titleColorStr = `border: 2px solid transparent;border-right:none;border-left:none;background: ${borderColor}; color: rgb(255, 255, 255);font-weight:100`
	const colorStr = `border: 2px solid transparent;background: ${bgColor}; color: rgb(255, 255, 255);font-weight:100`
	let pattern = `%c ${title} %c%s%c %o`
	let parameters = [titleColorStr, colorStr, ' noname ', '', val]
	if (typeof val === 'object') {
		pattern = `%c ${title} `
		parameters = [titleColorStr]
		const entries = Object.entries(val)
		const maxLength = entries.reduce(
			(a, [k]) => (a < k.length ? k.length : a),
			-Infinity
		)

		let first = true
		for (const [k, v] of entries) {
			pattern += '%c%s%c%s%c%s%o%s'
			parameters.push(
				titleColorStr,
				first ? '' : ` ${''.padStart(title.length, ' ')} `,
				colorStr,
				' ' + k.padEnd(maxLength, ' ') + ' ',
				'',
				' ',
				v,
				'\n'
			)
			first = false
		}
		parameters.pop()
		parameters.push('')
	}
	console.log(pattern, ...parameters)
}
window.log = log

interface ProxyMethods<T> {
	target: T
	handler: (target: Fn, thisArg: unknown, args: unknown[]) => unknown
	proxyKeys?: Keys
	ignoreKeys?: Keys
}
export function proxyMethods<T>({
	target,
	handler,
	proxyKeys,
	ignoreKeys,
}: ProxyMethods<T>): T {
	if (!proxyKeys) {
		if (typeof target.constructor === 'function') {
			// 1. 类的实例，方法从类原型上找
			proxyKeys = allKeys(Object.getPrototypeOf(target))
			const set = new Set(proxyKeys)
			set.delete('constructor')
			proxyKeys = Array.from(set)
		} else {
			// 2. 普通对象，仅遍历自身
			proxyKeys = allKeys(target as Obj)
		}
	}
	proxyKeys = proxyKeys.filter((k) => typeof (target as Obj)[k] === 'function')

	// 3. 去重 && 去除忽略键
	const set = new Set(proxyKeys)
	ignoreKeys && ignoreKeys.forEach((k) => set.delete(k))
	proxyKeys = Array.from(set)

	// 4. 为这些函数添加代理
	const fnMap = new Map<Key, Fn>()
	for (const k of proxyKeys) {
		const fn = (target as Obj)[k]
		if (typeof fn === 'function') {
			fnMap.set(
				k,
				new Proxy(fn, {
					apply(target, thisArg, args) {
						handler(target, thisArg, args)
						return target.call(thisArg, ...args)
					},
				})
			)
		}
	}

	// 5. 为对象添加代理，让方法函数的访问走代理
	return (new Proxy(target as Obj, {
		get(obj, k) {
			if (typeof k !== 'symbol') {
				return fnMap.has(k) ? fnMap.get(k) : obj[k]
			}
		},
	}) as unknown) as T
}

function allKeys<T>(obj: T): Keys {
	return Object.keys(Object.getOwnPropertyDescriptors(obj))
}
