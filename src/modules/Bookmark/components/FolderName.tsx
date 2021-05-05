/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-05-05 20:39:00
 * @Description: file content
 */
import React from 'react';

import folderSvg from '@img/folder.svg';
import folderOpenSvg from '@img/folder-open.svg';
import { loop, moduleClassnames } from 'utils';
import { SUB_NODE_PADDING_UNIT } from 'utils/const';
import { BookmarkTreeNode } from '../model/state';
import { Settings } from '../setup';
import c from '../index.m.scss';

const cn = moduleClassnames(c)

interface Props {
  node: BookmarkTreeNode
  settings: Settings
}

function FolderName({ node, settings }: Props): JSX.Element {
  const haveFolder = node.folders.length > 0
  return (
    <>
      <li
        role="menuitem"
        className={cn('folder-name', { open: haveFolder })}
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
        />
      ))
    }
    </>
  )
}

export default FolderName;
