import { useState, useRef, useMemo, useEffect } from 'react'
import { deboundFixed } from 'api'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-19 16:05:04
 * @LastEditTime: 2020-08-28 21:54:06
 * @Description: file content
 */
export const useForceRender = (): {
  renderCount: number
  refRenderCount: React.MutableRefObject<number>
  setRenderCount: React.Dispatch<React.SetStateAction<number>>
} => {
  const [renderCount, setRenderCount] = useState(0)
  const refRenderCount = useRef(renderCount)
  refRenderCount.current = useMemo(() => renderCount, [renderCount])
  return { renderCount, refRenderCount, setRenderCount }
}

