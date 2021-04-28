/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-11-11 07:59:07
 * @LastEditTime: 2021-04-28 22:49:09
 * @Description: file content
 */
import * as React from 'react';
import c from './index.m.scss';
import 'public/asset/iconfont';

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
