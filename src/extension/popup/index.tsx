import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Tab from 'components/Tab'
import '../runConcent'
import 'src/index.css'
import { useConcent } from 'concent'
import { useEffect } from 'react'
import { deboundFixed } from 'api'


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