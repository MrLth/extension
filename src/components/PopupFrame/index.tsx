/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-01-11 10:11:06
 * @LastEditTime: 2021-05-01 00:00:35
 * @Description: file content
 */
import React, {
  forwardRef, memo, MutableRefObject,
} from 'react';
import { NoMap, useConcent } from 'concent';
import { EmptyObject } from 'utils/type';
import { CtxM } from 'utils/type/concent';
import { LABEL_HEIGHT, POPUP_WIDTH } from 'utils/const';

import { isString } from 'lodash-es';
import c from './index.m.scss';

export interface PopupOption {
  title: string | JSX.Element
  icon: JSX.Element
  cb?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export interface PopupFrameProps {
  isShow: boolean
  left?: number
  width?: number
  top?: number
  minTop?: number
  maxBottom?: number
  targetTop?: number
  options?: PopupOption[] | (() => PopupOption[])
}

type Ctx = CtxM<EmptyObject, '$$global'>

function PopupFrame(props: PopupFrameProps, ref: MutableRefObject<HTMLUListElement>): JSX.Element {
  const {
    targetTop, isShow, minTop = 0,
  } = props
  let {
    top, left, options, width, maxBottom,
  } = props
  const {
    globalState: { windowSize },
  } = useConcent<EmptyObject, Ctx, NoMap>({ module: '$$global' });

  if (typeof options === 'function') options = options();

  width = width === undefined
    ? windowSize.width
    : Math.min(windowSize.width, width);
  maxBottom = maxBottom === undefined
    ? windowSize.height
    : Math.min(windowSize.height, maxBottom);

  left -= 30
  left = left + POPUP_WIDTH > width ? width - POPUP_WIDTH : left;
  left = Math.max(left, 0)

  const height = LABEL_HEIGHT * options.length;

  top = top < minTop ? minTop : top;
  if (top + height > maxBottom) {
    options.reverse();
    top = targetTop !== undefined ? targetTop - height : maxBottom - height;
  }

  return (
    <ul ref={ref} className={c.content} style={{ top, left, display: isShow ? 'block' : 'none' }}>
      {options.map((v, i) => (
        <li
          role="presentation"
          key={isString(v.title) ? v.title : i}
          onClick={v.cb}
        >
          <div>{v.icon}</div>
          <div>{v.title}</div>
        </li>
      ))}
    </ul>
  );
}

export default memo(forwardRef(PopupFrame));
