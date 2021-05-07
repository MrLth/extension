/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-05-05 15:48:31
 * @LastEditTime: 2021-05-07 13:43:58
 * @Description: file content
 */
import { usePrevious } from 'ahooks'
import React, { MutableRefObject, useRef } from 'react'
import { moduleClassnames } from 'utils'
import c from '../index.m.scss'
import { BookmarkTreeNode } from '../model/state'
import { Settings } from '../setup'
import FlatFolder from './FlatFolder'
import Label from './Label'

const cn = moduleClassnames(c)

interface Props {
  node: BookmarkTreeNode,
  settings: Settings
  asideRef: MutableRefObject<HTMLDivElement>
  sectionRef: MutableRefObject<HTMLDivElement>
}

function PiledOut({
  node, settings, asideRef, sectionRef,
}: Props): JSX.Element {
  const prevNodeRef = useRef<BookmarkTreeNode>(null)
  const prevNode = prevNodeRef.current
  const isHidden = prevNode?.id === node?.id
  $log({ node, prevNode, isHidden })

  prevNodeRef.current = isHidden ? null : node

  const left = asideRef.current?.clientWidth
  const maxWidth = left ? window.innerWidth - left : 0
  const width = sectionRef.current?.clientWidth

  return (
    <div
      className={cn('piled-out', {
        'piled-out-hidden': isHidden,
      })}
      style={{
        left,
        maxWidth,
      }}
    >
      <ul
        className={c['bookmark-list']}
      >
        {
          node?.children.map((child) => (
            'children' in child
              ? <FlatFolder key={child.id} node={child} settings={settings} width={width} />
              : <Label key={child.id} node={child} settings={settings} width={width} />))
        }
      </ul>
    </div>
  )
}

export default PiledOut
