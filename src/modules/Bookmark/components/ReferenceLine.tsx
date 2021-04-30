/*
* @Author: mrlthf11
 * @LastEditors: mrlthf11
* @Date: 2021-04-30 15:37:11
 * @LastEditTime: 2021-04-30 22:50:05
* @Description: file content
*/
import React, {
  memo,
  MutableRefObject, useMemo, useRef, useState,
} from 'react';
import { usePrevious, useScroll } from 'ahooks';
import { moduleClassnames } from 'utils';

import { LABEL_HEIGHT } from 'utils/const';
import c from '../index.m.scss'

const cn = moduleClassnames(c)

function isUpdate(prev: number | undefined, next: number) {
  return prev !== next && next !== -1
}

interface Props {
  reactiveRef: MutableRefObject<HTMLElement>
}

function ReferenceLine({ reactiveRef }: Props): JSX.Element {
  const scrollTop = useScroll(reactiveRef).top || 0
  const prevTop = usePrevious(scrollTop, isUpdate) ?? 0

  const [hide, setHide] = useState(true)
  const timerIdRef = useRef(0)

  const top = useMemo(() => {
    if (!reactiveRef.current) return 0
    // 触摸板的滚动过于平滑，效果不是很好，需要过滤一下
    if (Math.abs(scrollTop - prevTop) < 3 * LABEL_HEIGHT) return 0

    const direction = scrollTop > prevTop ? 'down' : 'up'

    setHide(false)
    clearTimeout(timerIdRef.current)
    timerIdRef.current = setTimeout(setHide, 3000, true)

    switch (direction) {
      case 'down':
        return prevTop + window.innerHeight
      case 'up':
        return prevTop
      default:
        return 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTop])

  return (
    <div
      className={cn('delimiter', {
        'delimiter-hide': hide || top === 0,
      })}
      style={{ top }}
    />
  )
}

export default memo(ReferenceLine)
