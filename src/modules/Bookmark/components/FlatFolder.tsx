/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 08:34:51
 * @LastEditTime: 2021-05-05 23:32:11
 * @Description: file content
 */
import { BookmarkTreeNode } from 'modules/Bookmark/model/state';
import React from 'react';
import { Settings } from '../setup';
import c from '../index.m.scss';
import Label from './Label';

const assembleTitle = (node: BookmarkTreeNode): string => (node.depth > 1 ? `${node.title} < ${assembleTitle(node.parent)}` : node.title);

interface Props {
  width: number
  node: BookmarkTreeNode
  settings: Settings
}

function FlatFolder({ node, settings, width }: Props): JSX.Element {
  return (
    <>
      <li className={c['folder-title']}>
        {assembleTitle(node)}
      </li>

      {
        node.children.map((v) => ('children' in v
          ? <FlatFolder key={v.id} node={v} settings={settings} width={width} />
          : <Label key={v.id} node={v} settings={settings} width={width} />))
      }

    </>
  );
}

export default FlatFolder;
