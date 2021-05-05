/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-05-05 15:48:31
 * @LastEditTime: 2021-05-05 21:00:31
 * @Description: file content
 */
import React from 'react'
import c from '../index.m.scss'
import { BookmarkTreeNode } from '../model/state'
import { Settings } from '../setup'
import Folder from './Folder'
import Label from './Label'

interface Props {
  node: BookmarkTreeNode,
  settings: Settings
}

function PiledOut({ node, settings }: Props): JSX.Element {
  $log({ node })
  return (
    <div className={c['piled-out']}>
      <ul
        className={c['bookmark-list']}
      >
        {
          node?.children.map((child) => (
            'children' in child
              ? <Folder key={child.id} node={child} settings={settings} />
              : <Label key={child.id} node={child} settings={settings} />))
        }
      </ul>
    </div>
  )
}

export default PiledOut
