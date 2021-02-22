/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-01-11 10:11:06
 * @LastEditTime: 2021-02-22 16:48:38
 * @Description: file content
 */
import React, { memo } from 'react';
// #region Import Style
import { moduleClassnames } from 'utils';
// #endregion

import { NoMap, useConcent } from 'concent';
import { EmptyObject, Fn } from 'utils/type';
import { CtxM } from 'utils/concent';
import c from './index.module.scss';

const cn = moduleClassnames.bind(null, c);

const width = 120;
const itemHeight = 32;

export interface PopupOption {
  title: string | JSX.Element
  icon: JSX.Element
  cb?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export interface PopupFrameProps {
  isShow: boolean
  left?: number
  minLeft?: number
  maxRight?: number
  top?: number
  minTop?: number
  maxBottom?: number
  targetTop?: number
  options?: PopupOption[] | (() => PopupOption[])
}

type Ctx = CtxM<EmptyObject, '$$global'>

const PopupFrame = (props: PopupFrameProps): JSX.Element => {
  const {
    targetTop, isShow, minLeft = 0, minTop = 0,
  } = props
  let {
    top, left, options, maxRight, maxBottom,
  } = props
  const {
    globalState: { windowSize },
  } = useConcent<EmptyObject, Ctx, NoMap>({ module: '$$global' });

  if (typeof options === 'function') options = options();

  maxRight = maxRight === undefined
    ? windowSize.width
    : Math.min(windowSize.width, maxRight);
  maxBottom = maxBottom === undefined
    ? windowSize.height
    : Math.min(windowSize.height, maxBottom);

  left = left + width > maxRight ? maxRight - width : left;
  left = left < minLeft ? minLeft : left;

  const height = itemHeight * options.length;

  top = top < minTop ? minTop : top;
  if (top + height > maxBottom) {
    options.reverse();
    top = targetTop !== undefined ? targetTop - height : maxBottom - height;
  }

  return (
    <ul className={c.content} style={{ top, left, display: isShow ? 'block' : 'none' }}>
      {options.map((v, i) => (
        <li
          role="presentation"
          key={i}
          onClick={v.cb}
        >
          <div>{v.icon}</div>
          <div>{v.title}</div>
        </li>
      ))}
    </ul>
  );
};

export default memo(PopupFrame);
