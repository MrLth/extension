/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2021-03-07 00:51:16
 * @Description: file content
 */
import React, { memo } from 'react';
import circleSvg from '@img/circle.svg';
import { preventDefault } from 'utils';
import { Settings } from '../setup';
import c from '../index.m.scss';

interface Props {
  item: chrome.history.HistoryItem
  settings: Settings
}
const LabelNoFavIcon = ({ item, settings }: Props) => (
  <li className={c.label}>
    <div
      role="presentation"
      className={c['unit-tab']}
      onClick={() => settings.openLabel(item.url)}
    >
      <img src={circleSvg} alt={item.url} />
      <a href={item.url} onClick={preventDefault}>
        {item.title === '' ? item.url : item.title}
      </a>
    </div>
  </li>

);

export default memo(LabelNoFavIcon);
