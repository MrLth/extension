/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-03-05 13:40:25
 * @Description: file content
 */
import React, { forwardRef } from 'react';
import { BookmarkTreeNode } from 'modules/Bookmark/model/state';
import { EmptyObject } from 'utils/type';
import { CtxDeS } from 'utils/type/concent';
import { SettingsType } from 'concent';
import c from '../index.m.scss';
import Folder from './Folder';
import Label from './Label';
// import { Settings } from '.';
import { Settings } from '../setup'
// import {Settings} from './index'

const initState = () => ({
});
// #region Type Statement
type State = ReturnType<typeof initState>
type CtxPre = CtxDeS<EmptyObject, State>
// #endregion
const setup = () => {
  console.log('default');
};
// #region Type Statement
export type MySettings = SettingsType<typeof setup>
type Ctx = CtxDeS<EmptyObject, State, MySettings>
// #endregion
interface Props {
  rootNode: BookmarkTreeNode
  settings: Settings
}
const BookmarkList = (
  { rootNode, settings }: Props,
  ref: React.Ref<HTMLUListElement>,
): JSX.Element => (
  <div
    className={c['bookmark-wrapper']}
    onScroll={settings.scrollCb}
  >
    <ul
      ref={ref}
      className={c['bookmark-list']}
      style={{ height: rootNode?.height ?? 0 }}
    >
      {
        rootNode?.children.map((v) => (
          'children' in v
            ? v.isRender && <Folder key={v.id} node={v} settings={settings} />
            : <Label key={v.id} node={v} settings={settings} />))
      }
    </ul>
  </div>
);

export default forwardRef(BookmarkList);
