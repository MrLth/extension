/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-30 19:17:56
 * @LastEditTime: 2021-05-01 00:51:28
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

  const heightTimelineRef = useRef(new TimeLine())

  useEffect(() => {
    const relativeDom = reactiveRef.current

    const onScroll = debounce(() => {
      $log({ scrollTop: relativeDom.scrollTop }, 'scrolled')
      setScrollTop(relativeDom.scrollTop)
    }, 300)

    const onResize = debounce(() => {
      const animation = new Animation({
        start: heightRef.current,
        end: window.innerHeight,
        duration: 500,
        delay: 1000,
        timingFunction: ease,
        updateCallback: setHeight,
      })
      heightTimelineRef.current
        .reset()
        .add(animation)
        .start()
    }, 300)

    relativeDom.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      relativeDom.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [heightRef, reactiveRef])

  const topTimelineRef = useRef(new TimeLine())

  useEffect(() => {
    $log({ prevScrollTop, scrollTop })
    if (prevScrollTop !== undefined && scrollTop !== prevScrollTop) {
      const animation = new Animation({
        start: prevScrollTop,
        end: scrollTop,
        duration: 500,
        delay: 1500,
        timingFunction: ease,
        updateCallback: setTop,
      })
      topTimelineRef.current
        .reset()
        .add(animation)
        .start()
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
