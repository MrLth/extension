import * as React from 'react'
import { useEffect, useState, useMemo, useCallback, useRef, useContext } from 'react'
import * as ReactDOM from 'react-dom'

// import Bookmark from '../../components/Bookmark'
import Tab from '../../components/Tab'

import 'src/index.css'
import './index.scss'

import { deboundFixed } from '../../api'

import { useConcent } from 'concent'
// import 'store/run'
import '../runConcent'
import Record from 'components/Record'

const randomNum = (minNum: number, maxNum: number) =>
    Number(Math.random() * (maxNum - minNum + 1) + minNum)

const getWindowWidth = () => window?.innerWidth ?? document?.body?.clientWidth

const minWidthIndex = (arr: number[]) => {
    let lowest = 0
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[lowest]) lowest = i
    }
    return lowest
}

// 大于1120为两列侧边，大于870小于1120为一列侧边，小于870为无侧边
const SIDE_WIDTH_THRESHOLD = [870, 1120]

function App() {

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

    // useEffect(() => {
    //     chrome.storage.local.get((storage) => {
    //         const urls = storage?.urls || []

    //         dispatch(recordActionInit(Array.from(urls)))

    //         const favicons = storage?.favicons || {}

    //         faviconStorageDispatch(faviconStorageActionAdd(favicons))
    //     })
    // }, [])

    // const [windowSize, setWindowSize] = useState(getWindowWidth)

    // useEffect(() => {
    //     const windowReSizeListener = deboundFixed(() => {
    //         setWindowSize(getWindowWidth())
    //     }, 100)

    //     window.addEventListener('resize', windowReSizeListener)
    //     return () => {
    //         window.removeEventListener('resize', windowReSizeListener)
    //     }
    // }, [])

    // const cardList = useMemo(() => {
    //     const list: [JSX.Element, number][] = []
    //     for (let i = 0; i < 20; i++) {
    //         const height = randomNum(100, 500)
    //         list.push([
    //             <li
    //                 className='card'
    //                 key={`card-${i}`}
    //                 style={{ height: height + 'px', lineHeight: height + 'px' }}
    //             >
    //                 {i}
    //             </li>,
    //             height
    //         ])
    //     }
    //     return list
    // }, [])

    // const colCount = useMemo(() => {
    //     let colCount = 2
    //     if (windowSize > 1390) colCount++
    //     if (windowSize > 1660) colCount++
    //     return colCount
    // }, [windowSize])

    // const cols = useMemo(() => {
    //     const cols = Array.from({ length: colCount }, (): JSX.Element[] => [])
    //     const colHeights = Array.from({ length: colCount }, () => 0)
    //     let minI
    //     cardList.forEach(([item, height]) => {
    //         minI = minWidthIndex(colHeights)
    //         cols[minI].push(item)
    //         colHeights[minI] += height

    //         // cols[i % colCount].push(item);
    //     })
    //     return cols
    // }, [colCount, cardList])

    // const leftSideRef = useRef<HTMLDivElement>()

    // const getSideWidth = () => {
    //     return leftSideRef.current?.getBoundingClientRect().width
    // }

    // const [sideWidth, setSideWidth] = useState(getSideWidth)
    // useEffect(() => {
    //     setTimeout(() => {
    //         setSideWidth(getSideWidth)
    //     }, /*animate duration*/ 300)
    // }, [windowSize])

    // const [leftSideStyle, setLeftSideStyle] = useState<React.CSSProperties>({})
    // const [rightSideStyle, setRightSideStyle] = useState<React.CSSProperties>({})
    // const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({})
    // const onMouseMoveCb = useCallback(
    //     deboundFixed(
    //         ({ target, clientX }) => {
    //             if (windowSize > SIDE_WIDTH_THRESHOLD[1]) {
    //                 if (clientX < sideWidth) {
    //                     setLeftSideStyle({ left: 0 })
    //                 } else if (clientX > windowSize - sideWidth) {
    //                     setRightSideStyle({ right: 0 })
    //                 } else {
    //                     setLeftSideStyle({ left: -sideWidth + 'px' })
    //                     setRightSideStyle({ right: -sideWidth + 'px' })
    //                 }
    //                 return
    //             }

    //             if (windowSize > SIDE_WIDTH_THRESHOLD[0]) {
    //                 if ((target as HTMLDivElement)?.classList.contains('leftSpace')) {
    //                     setContainerStyle({})
    //                     setRightSideStyle({ ...rightSideStyle, right: -(2 * sideWidth) + 'px' })
    //                 }

    //                 if (clientX < sideWidth) {
    //                     setLeftSideStyle({ ...leftSideStyle, left: 0 })
    //                 } else {
    //                     setLeftSideStyle({ ...leftSideStyle, left: -sideWidth + 'px' })
    //                 }

    //                 if ((target as HTMLDivElement)?.classList.contains('rightSpace')) {
    //                     setContainerStyle({ left: -sideWidth + 'px' })
    //                     setRightSideStyle({ ...rightSideStyle, right: -sideWidth + 'px' })
    //                 }

    //                 if (clientX > windowSize - sideWidth) {
    //                     setRightSideStyle({ ...rightSideStyle, right: -sideWidth + 'px' })
    //                 } else {
    //                     setRightSideStyle({ ...rightSideStyle, right: -(2 * sideWidth) + 'px' })
    //                 }

    //                 return
    //             }

    //             if (true) {
    //                 if ((target as HTMLDivElement)?.classList.contains('leftSpace')) {
    //                     setLeftSideStyle({ ...leftSideStyle, left: '0px' })
    //                 }

    //                 if (clientX > sideWidth) {
    //                     setLeftSideStyle({ ...leftSideStyle, left: -sideWidth + 'px' })
    //                 }

    //                 if ((target as HTMLDivElement)?.classList.contains('rightSpace')) {
    //                     setRightSideStyle({ ...rightSideStyle, right: '0px' })
    //                 }

    //                 if (clientX < windowSize - sideWidth) {
    //                     setRightSideStyle({ ...rightSideStyle, right: -sideWidth + 'px' })
    //                 }
    //             }
    //         },
    //         100,
    //         100
    //     ),
    //     [sideWidth, windowSize, leftSideStyle, rightSideStyle]
    // )

    // useEffect(() => {
    //     if (windowSize > SIDE_WIDTH_THRESHOLD[1]) {
    //         setContainerStyle({})
    //         setLeftSideStyle({})
    //         setRightSideStyle({})
    //         return
    //     }

    //     if (windowSize > SIDE_WIDTH_THRESHOLD[0]) {
    //         setContainerStyle({})
    //         setRightSideStyle({ width: sideWidth + 'px', right: -(2 * sideWidth) + 'px' })
    //         return
    //     }

    //     if (true) {
    //         setLeftSideStyle({ width: sideWidth + 'px', left: -sideWidth + 'px' })
    //         setRightSideStyle({ width: sideWidth + 'px', right: -sideWidth + 'px' })
    //     }
    // }, [windowSize, sideWidth])

    // // 添加事件
    // useEffect(() => {
    //     const mousemoveListener = (e: MouseEvent) => {
    //         const { target, clientX } = e
    //         onMouseMoveCb({ target, clientX })
    //     }
    //     document.body.addEventListener('mousemove', mousemoveListener)
    //     return () => {
    //         document.body.removeEventListener('mousemove', mousemoveListener)
    //     }
    // }, [onMouseMoveCb])

    return (
        // <div className="bookmark-wrapper">
        //   <Bookmark />
        // </div>
        <>
            <Record/>
            <div className='popup-wrapper'>
                <Tab />
            </div>
        </>
        // <div className="container" style={containerStyle}>
        //   <div className="leftSide bookmark-wrapper" ref={leftSideRef} style={leftSideStyle}>
        //     <Bookmark />
        //   </div>
        //   <div className="leftSpace"></div>
        //   <div className="centerContent">
        //     <ul className="wrapper">
        //       {cols.map((col, i) => {
        //         return (
        //           <li className="col" key={`col-${i}`}>
        //             <ul>{col}</ul>
        //           </li>
        //         )
        //       })}
        //     </ul>
        //   </div>
        //   <div className="rightSpace"></div>
        //   <div className="rightSide popup-wrapper" style={rightSideStyle}>
        //     <Popup />
        //   </div>
        // </div>
    )
}

ReactDOM.render(
    <div style={{display:'flex', justifyContent:'flex-end'}}>
        <App />
    </div>,
    document.getElementById('root')
)
