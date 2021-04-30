/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-30 23:23:28
 * @LastEditTime: 2021-04-30 23:26:09
 * @Description: file content
*/
import { useRef, MutableRefObject } from 'react'

function useUpdateRef<T>(source: T): MutableRefObject<T> {
  const ref = useRef(source)
  ref.current = source
  return ref
}

export default useUpdateRef
