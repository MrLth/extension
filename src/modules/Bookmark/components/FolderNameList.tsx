/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 23:06:05
 * @Description: file content
 */
import { BookmarkTreeNode } from 'modules/Bookmark/model/state';
import React from 'react';
import { Settings } from '../setup';
import FolderName from './FolderName';
import c from '../index.m.scss';

interface Props {
  folders: BookmarkTreeNode[]
  settings: Settings
}
const FolderList = ({ folders, settings }: Props): JSX.Element => (
  <ul className={c['folder-list']}>
    {
      folders?.map((v) => <FolderName key={v.id} node={v} settings={settings} />)
    }
  </ul>
);

export default FolderList;
