/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-05-08 08:39:20
 * @Description: file content
 */
import React, { memo, useRef } from 'react';
import useUpdateRef from 'hooks/useUpdateRef';
import { Settings, State } from '../setup';
import FolderName from './FolderName';
import { IdLinkList, BookmarkTreeNode } from '../model/type';

export interface FolderNameListProps {
  folders: BookmarkTreeNode[]
  settings: Settings
  state: State
  updateKey: number
}

function FolderNameList(
  {
    folders, settings, state, updateKey,
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
