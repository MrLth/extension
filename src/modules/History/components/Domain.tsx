/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2021-03-05 14:28:02
 * @Description: file content
 */

import React, { memo, useMemo } from 'react';
import Label from './Label';
import LabelNoFavIcon from './LabelNoFavIcon';
import { Settings } from '../setup';
import { HistoryItem } from '../api';

import c from '../index.m.scss';

interface Props {
  list: HistoryItem[]
  refreshCount: number
  settings: Settings
  refPrevTimeStr: React.MutableRefObject<string>
}
const Domain = ({
  list, settings, refreshCount, refPrevTimeStr,
}: Props) => {
  const jsxList = useMemo(() => {
    const ls = [];
    for (let i = 1, len = list.length; i < len; i += 1) {
      const v = list[i];
      ls.push(<LabelNoFavIcon key={v.id} item={v} settings={settings} />);
    }
    return ls;
  }, [list, settings]);

  return (
    <li className={c.domain}>
      <ul>
        <Label
          key={list[0].id}
          item={list[0]}
          refreshCount={refreshCount}
          settings={settings}
          refPrevTimeStr={refPrevTimeStr}
        />
        {jsxList}
      </ul>
    </li>
  );
};

export default memo(Domain);
