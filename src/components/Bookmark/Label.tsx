/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-19 16:25:32
 * @LastEditTime: 2020-09-01 22:20:33
 * @Description: file content
 */
import * as React from 'react'
import { BookmarkTreeNode, FaviconStorageObj } from '@store/bookmark/type'
import { useState, useContext, useEffect, memo } from 'react'
import { faviconUdpActionAdd } from '@store/bookmark/actions'
import { FaviconUpdDispatch } from '@store/record/type'
import { RecordContext } from '@store'
import { isLocal } from '@api'

const Label = memo(function Label(props: {
  node: BookmarkTreeNode
  faviconStorage: FaviconStorageObj
  faviconUpdDispatch: FaviconUpdDispatch
}): JSX.Element {
  const { node, faviconUpdDispatch, faviconStorage } = props


  const host = new URL(node.url).host
  const [imgSrc, setImgSrc] = useState(`chrome://favicon/size/18@2x/${node.url}`)

  return (
    <li
      className="label"
      onClick={(e) => {
        window.location.href.includes('chrome-extension')
          ? window.open(node.url)
          : (window.location.href = node.url)

        faviconUpdDispatch(
          faviconUdpActionAdd({
            host,
            updCb: (newSrc: string) => {
              setImgSrc(newSrc)
            },
          })
        )
        e.stopPropagation()
      }}>
      <img src={imgSrc} alt="" />
      {node.title}
    </li>
  )
})

export default Label
