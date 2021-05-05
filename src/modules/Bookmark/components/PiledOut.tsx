/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-05-05 15:48:31
 * @LastEditTime: 2021-05-05 23:30:36
 * @Description: file content
 */
import React, { MutableRefObject } from 'react'
import c from '../index.m.scss'
import { BookmarkTreeNode } from '../model/state'
import { Settings } from '../setup'
import FlatFolder from './FlatFolder'
import Label from './Label'

interface Props {
  node: BookmarkTreeNode,
  settings: Settings
  asideRef: MutableRefObject<HTMLDivElement>
  sectionRef: MutableRefObject<HTMLDivElement>
}

function PiledOut({
  node, settings, asideRef, sectionRef,
}: Props): JSX.Element {
  $log({ node })

  const left = asideRef.current?.clientWidth
  const maxWidth = left ? window.innerWidth - left : 0
  const width = sectionRef.current?.clientWidth

  return (
    <div
      className={c['piled-out']}
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
