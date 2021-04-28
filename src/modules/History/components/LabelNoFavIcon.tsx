/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2021-04-28 09:25:37
 * @Description: file content
 */
import React, { memo } from 'react';
import { preventDefault } from 'utils';
import IconFont from 'components/IconFont';
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
      <span className={c['no-icon']}>
        <IconFont type="icon-dot" />
      </span>
      <a href={item.url} onClick={preventDefault}>
        {item.title === '' ? item.url : item.title}
      </a>
    </div>
  </li>

);

export default memo(LabelNoFavIcon);
