/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-11-11 07:59:07
 * @LastEditTime: 2021-02-22 16:54:41
 * @Description: file content
 */
import * as React from 'react';
import 'public/asset/iconfont';

import c from './index.module.scss';

interface IconFontProps {
  type: string
  onClick?: (...args: unknown[]) => unknown
}
const IconFont = (props: IconFontProps): JSX.Element => {
  const { type, onClick } = props;
  return (
    <svg className={c['icon-font']} aria-hidden="true" onClick={onClick}>
      <use xlinkHref={`#${type}`} />
    </svg>
  );
};
IconFont.defaultProps = {
  onClick: () => 0,
}

export default IconFont;
