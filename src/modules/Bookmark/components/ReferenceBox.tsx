/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-30 19:17:56
 * @LastEditTime: 2021-05-01 18:41:13
 * @Description: file content
 */

import React, {
  MutableRefObject, useRef, useEffect, useState,
} from 'react'
import { usePrevious } from 'ahooks'
import { debounce } from 'lodash-es'
import Animation from 'utils/animate/Animation'
import { ease } from 'utils/animate/timing-function'
import TimeLine from 'utils/animate/TimeLine'
import useUpdateRef from 'hooks/useUpdateRef'
import c from '../index.m.scss'

interface Props {
  reactiveRef: MutableRefObject<HTMLElement>
}

function ReferenceBox({ reactiveRef }: Props): JSX.Element {
  const absoluteRef = useRef<HTMLDivElement>()

  const [top, setTop] = useState(0)
  const [height, setHeight] = useState(window.innerHeight)
  const heightRef = useUpdateRef(height)

  const [scrollTop, setScrollTop] = useState(0)
  const prevScrollTop = usePrevious(scrollTop)

  useEffect(() => {
    const relativeDom = reactiveRef.current

    const onScroll = debounce(() => {
      $log({ scrollTop: relativeDom.scrollTop }, 'scrolled')
      setScrollTop(relativeDom.scrollTop)
    }, 1000)

    const onResize = debounce(() => {
      setHeight(window.innerHeight)
    }, 300)

    relativeDom.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      relativeDom.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [heightRef, reactiveRef])

  useEffect(() => {
    $log({ prevScrollTop, scrollTop })
    if (prevScrollTop !== undefined && scrollTop !== prevScrollTop) {
      setTop(scrollTop)
    }
  }, [prevScrollTop, scrollTop])

  $log({ top })

  return (
    <div
      ref={absoluteRef}
      className={c['ref-box']}
      style={{ top, height }}
    />
  )
}

export default ReferenceBox
