import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Popup from 'components/Tab'
import '../runConcent'
import 'src/index.css'


const App = () => {
    return (
        <>
            <div className='popup-wrapper'>
                <Popup/>
            </div>
        </>
    )
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
)