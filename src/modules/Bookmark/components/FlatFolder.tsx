/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 08:34:51
 * @LastEditTime: 2021-05-08 08:41:11
 * @Description: file content
 */
import React from 'react';
import { Settings } from '../setup';
import c from '../index.m.scss';
import Label from './Label';
import { BookmarkTreeNode } from '../model/type';

function assembleTitle(node: BookmarkTreeNode, rootId: number): string {
  if (+node.parentId === rootId) {
    return node.title
  }
  return node.depth > 1 ? `${assembleTitle(node.parent, rootId)} > ${node.title}` : node.title;
}

interface Props {
  width: number
  node: BookmarkTreeNode
  settings: Settings
  rootId: number
}

function FlatFolder({
  node, settings, width, rootId,
}: Props): JSX.Element {
  return (
    <>
      <li style={{ width }}>
        <h3 className={c['folder-title']}>{assembleTitle(node, rootId)}</h3>
      </li>

      {
        node.children.map((v) => ('children' in v
          ? <FlatFolder key={v.id} node={v} settings={settings} width={width} rootId={rootId} />
          : <Label key={v.id} node={v} settings={settings} width={width} />))
      }

    </>
  );
}

export default FlatFolder;
