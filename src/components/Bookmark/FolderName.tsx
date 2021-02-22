/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 17:29:08
 * @Description: file content
 */
import React from 'react';

import folderSvg from '@img/folder.svg';
import folderOpenSvg from '@img/folder-open.svg';
import { moduleClassnames } from 'utils';
import { SUB_NODE_PADDING_UNIT } from 'utils/const';
import { BookmarkTreeNode } from './model/state';
import { Settings } from './setup';
// #region 样式绑定
import c from './index.module.scss';
// #endregion

const cn = moduleClassnames.bind(null, c);

interface Props {
  node: BookmarkTreeNode
  settings: Settings
}
const FolderName = ({ node, settings }: Props): JSX.Element => (node.folders.length > 0
  ? (
    <>
      <li
        className={cn('folder-name', 'open')}
        style={{ paddingLeft: node.depth * SUB_NODE_PADDING_UNIT }}
        onMouseEnter={(e) => settings.scrollToShow(e, node)}
      >
        <img src={folderOpenSvg} alt="folder-open" />
        {node.title}
      </li>
      {
        node.folders.map((v) => <FolderName key={v.id} node={v} settings={settings} />)
      }
    </>
  )
  : (
    <li
      className={c['folder-name']}
      style={{ paddingLeft: node.depth * SUB_NODE_PADDING_UNIT }}
      onMouseEnter={(e) => settings.scrollToShow(e, node)}
    >
      <img src={folderSvg} alt="folder" />
      {node.title}
    </li>
  ));

export default FolderName;
