import * as React from 'react'
import { useEffect, useReducer, useContext, useMemo } from 'react'
import { BookmarksReducer } from '@store/bookmark/reducers'
import { bookmarkActionInit } from '@store/bookmark/actions'
import Folder from './Folder'
import Label from './Label'
import { RecordContext } from '@store'

import './index.scss'

const Bookmark = (): JSX.Element => {
  const [tree, dispatch] = useReducer(BookmarksReducer, [])
  const { faviconStorage, faviconUpdDispatch } = useContext(RecordContext)

  useEffect(() => {
    chrome.bookmarks.getTree((rst) => {
      const bookmarksTree = rst[0]?.children[0]?.children || []

      dispatch(bookmarkActionInit(bookmarksTree))
    })
  }, [])

  const list = useMemo(
    () =>
      tree.map((node) => {
        return node.children ? (
          <Folder
            node={node}
            path={node.id}
            faviconStorage={faviconStorage}
            faviconUpdDispatch={faviconUpdDispatch}
          />
        ) : (
          <Label
            node={node}
            faviconStorage={faviconStorage}
            faviconUpdDispatch={faviconUpdDispatch}
          />
        )
      }),
    [tree, faviconStorage]
  )

  return (
    <div className='bookmark'>
      <div className='side-title'>BOOKMARK</div>
      <ul className='bookmark-list'>{list}</ul>
    </div>
  )
}

export default Bookmark
