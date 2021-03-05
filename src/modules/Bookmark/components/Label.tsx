/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-03-05 14:23:35
 * @Description: file content
 */
import { BookmarkTreeNode } from 'modules/Bookmark/model/state';
import React from 'react';
import defaultIcon from '@img/defaultIcon.svg';
import { preventDefault } from 'utils';
import c from '../index.m.scss';
import { Settings } from '../setup';

interface Props {
  node: BookmarkTreeNode
  settings: Settings
}
const Label = ({ node, settings }: Props): JSX.Element => (
  <li
    className={c.label}
    style={node.depth === 1 ? { position: 'absolute', top: node.top } : {}}
  >
    <div
      role="presentation"
      className={c['unit-tab']}
      onClick={() => settings.openTab(node.url)}
    >
      <img
        src={
          node.url !== ''
            ? `chrome://favicon/size/18@2x/${node.url}`
            : defaultIcon
        }
        alt="favicon"
        title={node.url}
      />
      <a href={node.url} onClick={preventDefault}>{node.title === '' ? node.url : node.title}</a>
    </div>
  </li>
);

export default Label;
