import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useConcent } from 'concent'
import { deboundFixed } from 'api'

import 'normalize.css/normalize.css'
import 'src/index.scss'

import '../runConcent'


import Tab from 'components/Tab'

const App = () => {
    const { setState } = useConcent('$$global')

    useEffect(() => {
        const windowResizeListener = deboundFixed(() => {
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