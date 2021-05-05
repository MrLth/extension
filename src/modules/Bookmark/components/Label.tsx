/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-05-05 23:29:05
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
  width?: number
}

function Label({ node, settings, width }: Props): JSX.Element {
  const style = {}

  if (node.depth === 1) {
    Object.assign(
      style,
      {
        position: 'absolute',
        top: node.top,
      },
    )
  }

  if (width) {
    Object.assign(
      style,
      {
        width,
      },
    )
  }

  return (
    <li
      className={c.label}
      style={style}
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
}

Label.defaultProps = {
  width: NaN,
}

export default Label;
