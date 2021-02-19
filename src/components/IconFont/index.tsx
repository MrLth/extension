/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-11-11 07:59:07
 * @LastEditTime: 2021-02-19 16:10:10
 * @Description: file content
 */
import * as React from 'react'
import 'public/asset/iconfont.js'

import c from './index.module.scss'

const IconFont = (props: {
  type: string
  onClick?: (...args: unknown[]) => unknown
}): JSX.Element => {
  const { type, onClick } = props
  return (
    <svg className={c["icon-font"]} aria-hidden="true" onClick={onClick}>
      <use xlinkHref={`#${type}`} />
    </svg>
  )
}

export default IconFont
