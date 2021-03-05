/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 08:34:51
 * @LastEditTime: 2021-03-05 13:45:27
 * @Description: file content
 */
import { BookmarkTreeNode } from 'modules/Bookmark/model/state';
import React from 'react';
import { Settings } from '../setup';
import c from '../index.m.scss';
import Label from './Label';

const assembleTitle = (node: BookmarkTreeNode): string => (node.depth > 1 ? `${node.title} < ${assembleTitle(node.parent)}` : node.title);

interface Props {
  node: BookmarkTreeNode
  settings: Settings
}
const Folder = ({ node, settings }: Props): JSX.Element => (
  <li
    className={c.folder}
    style={
      node.depth === 1
        ? { position: 'absolute', top: node.top }
        : {}
    }
  >
    <h3 className={c['folder-title']}>
      {assembleTitle(node)}
    </h3>
    <ul>
      {
        node.children.map((v) => ('children' in v
          ? <Folder key={v.id} node={v} settings={settings} />
          : <Label key={v.id} node={v} settings={settings} />))
      }
    </ul>
  </li>
);

export default Folder;
