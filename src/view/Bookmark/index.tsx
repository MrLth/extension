import * as React from 'react'
import { useContext, useEffect, useMemo, useCallback, useState, useReducer } from 'react'
import { BookmarksReducer } from '@store/bookmark/reducers'
import { bookmarkActionInit } from '@store/bookmark/actions'


const Bookmark = (): JSX.Element => {
    const [tree, dispatch] = useReducer(BookmarksReducer, [])
    useEffect(()=>{
        chrome.bookmarks.getTree((rst)=>{
            const bookmarksTree = rst[0]?.children[0]?.children || []
            
            dispatch(bookmarkActionInit(bookmarksTree))
        })
    }, [])

    

    console.log("tree", tree);
    

    return (
        <ul>
            {tree.map(node=>{
                return <li>
                    {node.title}
                </li> 
            })}
        </ul>
    )
}

export default Bookmark
