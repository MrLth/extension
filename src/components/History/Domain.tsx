import React, { memo, useMemo } from 'react';
import { Fn } from 'utils/type';
import { Settings } from '.';
// #region Import Style
import c from './index.module.scss';
// #endregion
import Label from './Label';

import LabelNoFavIcon from './LabelNoFavIcon';
import { HistoryItem } from './api';

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-18 10:52:32
 * @Description: file content
 */
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
    for (let i = 1, len = ls.length; i < len; i += 1) {
      const v = list[i];
      ls.push(<LabelNoFavIcon key={v.id} item={v} settings={settings} />);
    }
    return ls;
  }, [list, settings]);

  return (
    <ul className={c.domain}>
      <Label
        key={list[0].id}
        item={list[0]}
        refreshCount={refreshCount}
        settings={settings}
        refPrevTimeStr={refPrevTimeStr}
      />
      {jsxList}
    </ul>
  );
};

export default memo(Domain);
