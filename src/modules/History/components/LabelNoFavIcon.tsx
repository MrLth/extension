/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2021-02-22 01:31:27
 * @Description: file content
 */
import React, { memo } from 'react';
import circleSvg from '@img/circle.svg';
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
      {item.title === '' ? item.url : item.title}
    </div>
  </li>

);

export default memo(LabelNoFavIcon);
