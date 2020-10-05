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
