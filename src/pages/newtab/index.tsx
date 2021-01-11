import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { debounce } from 'lodash'
import { useConcent } from 'concent'


import 'normalize.css/normalize.css'
import 'src/index.scss'

import '../runConcent'
import Tab from '../../components/Tab'
import Record from 'components/Record'
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
