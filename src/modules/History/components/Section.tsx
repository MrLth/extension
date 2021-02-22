/* eslint-disable no-param-reassign */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2021-02-22 23:24:20
 * @Description: file content
 */
import React, { memo, useEffect, useRef } from 'react';
import { EmptyObject } from 'utils/type';
import { NoMap, SettingsType, useConcent } from 'concent';
import { HistorySection } from 'modules/History/model/state';
import { CtxDeS } from 'utils/concent';
import { sortByKey } from 'utils';
import Domain from './Domain';
import Label from './Label';
import { Settings } from '../setup';
import { HistoryItem } from '../api';

import c from '../index.m.scss';

const ONE_DAY = 86400000;

function dayFormat(timeStamp: number): string {
  const date = new Date(new Date(timeStamp).setHours(0, 0, 0, 0));
  const nowDate = new Date(new Date().setHours(0, 0, 0, 0));

  const dateNum = date.valueOf();
  const nowDateNum = nowDate.valueOf();
  if (dateNum === nowDateNum) {
    return '今天';
  } if (dateNum === nowDateNum - ONE_DAY) {
    return '昨天';
  }

  return `${String.prototype.padStart.call(date.getMonth() + 1, 2, '0')}.${String.prototype.padStart.call(date.getDate(), 2, '0')} 周${['末', '一', '二', '三', '四', '五', '六'][date.getDay()]}`;
}

interface VisitItem extends chrome.history.VisitItem {
  isRead?: boolean
}
const initState = () => ({
  refreshCount: 0,
});
// #region Type Statement
type State = ReturnType<typeof initState>
type CtxPre = CtxDeS<EmptyObject, State>
// #endregion
const setup = (ctx: CtxPre) => {
  const updQueue = [] as HistoryItem[];
  const visits = new Map<string, VisitItem[]>();

  const settings = {
    // TODO: fix it with 面向对象
    setLabelVisitTime: (label: HistoryItem, section: HistorySection): void => {
      if (label.visitCount === 1) {
        label.visitTime = label.lastVisitTime;
        return;
      }

      if (label.isAddToQueue === undefined) {
        updQueue.push(label);
        label.isAddToQueue = true;
        return;
      }

      const list = visits.get(label.id);
      if (list === undefined) return;

      const visitItem = list
        .filter(
          (v) => v.visitTime >= section.startTime
            && v.visitTime <= section.endTime
            && v.isRead !== true,
        )
        .pop();
      if (visitItem === undefined) return;

      visitItem.isRead = true;
      label.visitTime = visitItem.visitTime;
    },
    updVisitTime: () => {
      let updCount = updQueue.length;
      const cb = (rst: chrome.history.VisitItem[]) => {
        if (rst.length > 0) visits.set(rst[0].id, rst);
        updCount -= 1;
        if (updCount === 0) {
          ctx.setState({ refreshCount: ctx.state.refreshCount + 1 });
        }
      }
      for (const label of updQueue) {
        chrome.history.getVisits({ url: label.url }, cb);
      }
    },
    test() {
      console.log(updQueue.sort(sortByKey<HistoryItem>('visitTime', true)));
      console.log(visits);
    },

  };
  return settings;
};
// #region Type Statement
export type MySettings = SettingsType<typeof setup>
type Ctx = CtxDeS<EmptyObject, State, MySettings>
// #endregion
interface Props {
  status: 'loading' | 'completed'
  section: HistorySection
  // endTime: number
  top: number
  settings: Settings
}
const Section = ({ section, settings, top }: Props) => {
  const ctx = useConcent<EmptyObject, Ctx, NoMap>({ setup, state: initState });
  const { updVisitTime, setLabelVisitTime, test } = ctx.settings;
  const { refreshCount } = ctx.state;

  const refPrevTimeStr = useRef<string>();
  refPrevTimeStr.current = '';

  useEffect(() => {
    if (section.status === 'completed') {
      updVisitTime();
    }
  }, [section.status, updVisitTime]);

  return (
    <ul className={c.section} style={{ top }}>
      <li
        role="presentation"
        className={c.date}
        onClick={() => {
          test();
          console.log('section', section);
        }}
      >
        {dayFormat(section.startTime)}
      </li>
      {
        section.list.map((item) => {
          const firstLabel = item.list[0];
          setLabelVisitTime(firstLabel, section);

          return item.list.length > 1
            ? (
              <Domain
                key={firstLabel.id}
                list={item.list}
                refreshCount={refreshCount}
                settings={settings}
                refPrevTimeStr={refPrevTimeStr}
              />
            )
            : (
              <Label
                key={firstLabel.id}
                item={item.list[0]}
                refreshCount={refreshCount}
                settings={settings}
                refPrevTimeStr={refPrevTimeStr}
              />
            );
        })
      }
    </ul>
  );
};

export default memo(Section);
