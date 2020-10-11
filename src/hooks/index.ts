import { useRef, useEffect } from 'react'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-19 16:05:04
 * @LastEditTime: 2020-10-11 18:03:55
 * @Description: file content
 */
export const useRefVal = <T>(value: T): React.MutableRefObject<T> => {
	const valueRef = useRef(value)
	useEffect(() => {
		valueRef.current = value
	}, [value])
	return valueRef
}

export const useRefObj = <T>(obj: T): React.MutableRefObject<T> => {
	const refObj = useRef(obj)
	useEffect(() => {
		refObj.current = obj
	}, [...Object.values(obj)])
	return refObj
}
