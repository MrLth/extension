/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-02-20 17:40:07
 * @Description: file content
 */
import React, { useEffect } from 'react'
import { debounce } from 'lodash-es'
import { useConcent } from 'concent'
import { hot } from 'react-hot-loader/root';


import 'normalize.css/normalize.css'
import 'src/index.scss'

import '../runConcent'
import Tab from '../../components/Tab'
import History from 'components/History'
import Bookmark from 'components/Bookmark'
console.log('apsp')

function App(): JSX.Element {


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
    </>
  )
}


export default hot(App)