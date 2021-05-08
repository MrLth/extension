/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-05-08 09:26:46
 * @Description: file content
 */
import React, { memo, MutableRefObject } from 'react';

import folderSvg from '@img/folder.svg';
import folderOpenSvg from '@img/folder-open.svg';
import { loop, moduleClassnames } from 'utils';
import { SUB_NODE_PADDING_UNIT } from 'utils/const';
import useUpdateRef from 'hooks/useUpdateRef';
import { useWhyDidYouUpdate } from 'use-hooks';
import { BookmarkTreeNode, IdLinkList } from '../model/type';
import { Settings, State, initLinkList } from '../setup';
import c from '../index.m.scss';

const cn = moduleClassnames(c)

interface Props {
  node: BookmarkTreeNode
  settings: Settings
  state: State
  updateKey: number
}

function FolderName({
  node, settings, state, updateKey,
}: Props): JSX.Element {
  const haveFolder = node.folders.length > 0

  useWhyDidYouUpdate('folderName updated', {
    node, settings, state, updateKey,
  })
  return (
    <>
      <li
        role="menuitem"
        className={cn('folder-name', {
          open: haveFolder,
          'folder-name-activated': state.clickedFolder === node && !state.isHidePiledOut,
        })}
        style={{ paddingLeft: node.depth * SUB_NODE_PADDING_UNIT }}
        onMouseEnter={(e) => settings.scrollToShow(e, node)}
        onClick={() => settings.piledOutShow(node)}
        onKeyDown={loop}
      >
        <img src={haveFolder ? folderOpenSvg : folderSvg} alt="folder" />
        {node.title}
      </li>
      {
        haveFolder
        && node.folders.map((child) => (
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
  )
}

export default memo(FolderName);
