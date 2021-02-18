/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-02-18 17:14:07
 * @Description: file content
 */
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useConcent } from 'concent'
import { debounce } from 'lodash-es'


import 'normalize.css/normalize.css'
import 'src/index.scss'

import '../runConcent'


import Tab from 'components/Tab'

const App = () => {
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
            <div className='popup-wrapper' style={{ minHeight: `${4.9125 + 2 * 7}rem`, minWidth: 300 }}>
                <Tab />
            </div>
        </>
    )
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
)