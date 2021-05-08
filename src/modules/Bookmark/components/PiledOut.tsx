/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-05-05 15:48:31
 * @LastEditTime: 2021-05-08 10:59:01
 * @Description: file content
 */
import React, {
  MutableRefObject, memo, useState, useEffect, useMemo,
} from 'react'
import { moduleClassnames } from 'utils'
import c from '../index.m.scss'
import { BookmarkTreeNode } from '../model/type'
import { Settings } from '../setup'
import FlatFolder from './FlatFolder'
import Label from './Label'

const cn = moduleClassnames(c)

interface Props {
  node: BookmarkTreeNode,
  settings: Settings
  asideRef: MutableRefObject<HTMLDivElement>
  sectionRef: MutableRefObject<HTMLDivElement>
  hide: boolean
}

function PiledOut({
  node, settings, asideRef, sectionRef, hide,
}: Props): JSX.Element {
  const left = asideRef.current?.clientWidth
  const maxWidth = left ? document.body.clientWidth - left : 0
  const width = sectionRef.current?.clientWidth

  const [displayNone, setDisplayNone] = useState(true)
  // display 的变化必须在 transition 之前，不然动画失效
  // 这里使用一定手段，使 display:block 总是在 hide 更新时更新，
  // 而 isHidden 通过 useEffect 在下次 render 中更新
  const [isHidden, setIsHidden] = useState(true)

  useEffect(() => {
    setIsHidden(hide)
    if (!hide) {
      setDisplayNone(false)
    }
  }, [hide])

  const bookmarkList = useMemo(
    () => node?.children.map((child) => (
      'children' in child
        ? (
          <FlatFolder
            key={child.id}
            node={child}
            settings={settings}
            width={width}
            rootId={+node.id}
          />
        )
        : <Label key={child.id} node={child} settings={settings} width={width} />)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [node, width],
  )

  return (
    <div
      className={cn('piled-out', {
        'piled-out-hidden': isHidden,
        'display-none': hide && displayNone,
      })}
      style={{
        left,
        maxWidth,
      }}
      onTransitionEnd={() => {
        if (hide) {
          setDisplayNone(true)
        }
      }}
    >
      <ul className={c['bookmark-list']}>
        {bookmarkList}
      </ul>
    </div>
  )
}

export default memo(PiledOut)
