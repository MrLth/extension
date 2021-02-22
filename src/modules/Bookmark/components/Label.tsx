/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 23:06:24
 * @Description: file content
 */
import { BookmarkTreeNode } from 'modules/Bookmark/model/state';
import React from 'react';
import defaultIcon from '@img/defaultIcon.svg';
import c from '../index.m.scss';
import { Settings } from '../setup';

interface Props {
  node: BookmarkTreeNode
  settings: Settings
}
const Label = ({ node, settings }: Props): JSX.Element => (
  <li
    role="presentation"
    className={c.label}
    style={node.depth === 1 ? { position: 'absolute', top: node.top } : {}}
    onClick={() => settings.openTab(node.url)}
  >
    <div className={c['unit-tab']}>
      <img
        src={
          node.url !== ''
            ? `chrome://favicon/size/18@2x/${node.url}`
            : defaultIcon
        }
        alt={node.url}
      />
      {node.title === '' ? node.url : node.title}
    </div>
  </li>
);

export default Label;
