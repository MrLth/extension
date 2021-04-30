/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-04-30 15:29:51
 * @Description: file content
 */
import { BookmarkTreeNode } from 'modules/Bookmark/model/state';
import React, { memo } from 'react';
import { Settings } from '../setup';
import FolderName from './FolderName';

export interface FolderNameListProps {
  folders: BookmarkTreeNode[]
  settings: Settings
}

function FolderNameList(
  { folders, settings }: FolderNameListProps,
): JSX.Element {
  return (
    <>
      {
        folders?.map((v) => <FolderName key={v.id} node={v} settings={settings} />)
      }
    </>
  );
}

export default memo(FolderNameList);
