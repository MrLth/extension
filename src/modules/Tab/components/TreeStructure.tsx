/* eslint-disable react/no-array-index-key */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-28 20:04:47
 * @LastEditTime: 2021-04-29 16:39:47
 * @Description: file content
 */
import React, { memo } from 'react'
import c from '../index.m.scss'

interface Props {
  structure: string
}

const pathMap = new Map<string, React.SVGProps<SVGPathElement>[]>([
  ['┃', [<path key="┃" d="M 90 0 L 90 480 L 135 480 L 135 0 L 90 0 Z" />]],
  ['┣', [
    <path key="┣1" d="M 90 0 L 90 480 L 135 480 L 135 0 L 90 0 Z" />,
    <path key="┣2" d="M 135 240 L 200 240 C 225 240 225 290 200 290 L 135 290 L 135 240 Z" />,
  ]],
  ['┗', [
    <path key="┗1" d="M 90 0 L 90 240 L 135 240 L 135 0 L 90 0 Z" />,
    <path key="┗2" d="M 135 240 L 200 240 C 225 240 225 290 200 290 L 135 290 L 135 240 Z" />,
    <path key="┗3" d="M 90 240 C 90 265 112.132 290 135 290 C 160 290 135 240 135 240 L 90 240 Z" />,
  ]],
])

function TreeStructure({ structure }: Props) {
  return (
    <>
      {[...structure].map((char, i) => {
        if (char === ' ' || !pathMap.get(char)) {
          return <svg key={i} className={c['tree-img']} />
        }
        return (
          <svg key={i} className={c['tree-img']} viewBox="0 0 270 480">
            {pathMap.get(char)}
          </svg>
        )
      })}

    </>
  );
}

export default memo(TreeStructure)
