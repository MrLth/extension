/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-02-19 16:35:21
 * @Description: file content
 */
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { debounce } from 'lodash-es'
import { useConcent } from 'concent'


import 'normalize.css/normalize.css'
import 'src/index.scss'

import '../runConcent'
import Tab from '../../components/Tab'
// import Record from 'components/Record'
import History from 'components/History'
import Bookmark from 'components/Bookmark'


function App() {

    const { setState } = useConcent('$$global')

    useEffect(() => {
        const windowResizeListener = debounce(() => {
            setState({
                windowSize: {
                    width: window?.innerWidth,
                    height: window?.innerHeight
                }
            })
        }, 300)
        window.addEventListener('resize', windowResizeListener)
        return () => {
            window.removeEventListener('resize', windowResizeListener)
        }
    }, [])

    return (
        <>
            <Bookmark />
            <Tab />
            <History />
            {/* <Record /> */}
        </>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
