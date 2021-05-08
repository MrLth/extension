/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-05-08 11:36:24
 * @Description: file content
 */
import React, { memo } from 'react';
import { Settings, State } from '../setup';
import FolderName from './FolderName';
import { BookmarkTreeNode } from '../model/type';

export interface FolderNameListProps {
  folders: BookmarkTreeNode[]
  settings: Settings
  state: State
  updateKey: number
}

function FolderNameList(
  {
    folders, settings, state,
  }: FolderNameListProps,
): JSX.Element {
  return (
    <>
      {
        folders?.map((child) => (
          <FolderName
            key={child.id}
            node={child}
            settings={settings}
            state={state}
            updateKey={child.updateKey}
          />
        ))
      }
    </>
  );
}

export default memo(FolderNameList);
