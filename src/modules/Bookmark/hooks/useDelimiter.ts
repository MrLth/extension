/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-30 13:53:03
 * @LastEditTime: 2021-05-08 11:36:41
 * @Description: file content
 */
import {
  useMap, usePrevious, useScroll,
} from 'ahooks'
import {
  MutableRefObject, useEffect, useRef,
} from 'react'

function isUpdate(prev: number | undefined, next: number) {
  return prev !== next && next !== -1
}

interface DelimiterItem {
  top: number,
  isShow: boolean
}

function useDelimiter(
  relativeRef: MutableRefObject<HTMLElement>,
  absoluteRef: MutableRefObject<HTMLElement>,
): [
    [number, boolean][],
    (prevTop: number) => number
  ] {
  const { top } = useScroll(absoluteRef) // NaN ?? 0 => NaN
  const prevTop = usePrevious(top, isUpdate)

  const directionRef = useRef<'down' | 'up'>('down')

  const [delimiterMap, { set, reset }] = useMap<number, DelimiterItem>()

  const height = relativeRef.current?.clientHeight ?? 0
  // const newTop = (((prevTop - top) % height) + height) % height

  function computeTop(_top: number): number {
    return (((_top - top) % height) + height) % height
  }

  useEffect(() => {
    const direction = top > prevTop ? 'down' : 'up'
    if (direction !== directionRef.current) {
      directionRef.current = direction
      for (const delimiter of delimiterMap.values()) {
        delimiter.isShow = false
      }
    }

    $log({ direction, ref: directionRef.current })

    const newTop = prevTop + height
    if (newTop) {
      set(newTop, {
        top: newTop,
        isShow: true,
      })
      setTimeout(set, 5000, newTop, {
        top: newTop,
        isShow: false,
      })
    }
  }, [delimiterMap, prevTop, height, relativeRef, reset, set, top])

  const delimiters: [number, boolean][] = [...delimiterMap.values()].map((delimiter) => {
    $log({ item: delimiter })
    if (!delimiter.isShow) {
      setTimeout(() => delimiterMap.delete(delimiter.top), 1000)
    }
    return [delimiter.top, delimiter.isShow]
  })

  $log({ delimiters })

  return [delimiters, computeTop]
}

export default useDelimiter
