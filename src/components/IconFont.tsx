import * as React from 'react'
import 'public/asset/iconfont.js'

const IconFont = (props: {
  type: string
  onClick: (...args: unknown[]) => unknown
}): JSX.Element => {
  const { type, onClick } = props
  return (
    <svg className="icon-font" aria-hidden="true" onClick={onClick}>
      <use xlinkHref={`#${type}`} />
    </svg>
  )
}

export default IconFont
