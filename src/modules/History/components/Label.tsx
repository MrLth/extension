/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2021-03-05 14:24:26
 * @Description: file content
 */
import React, {
  memo, useEffect, useMemo, useRef, useState,
} from 'react';
import { useRefVal } from 'utils/hooks';
import { HOUR } from 'utils/const'
import defaultIcon from '@img/defaultIcon.svg';
import { preventDefault } from 'utils';
import { Settings } from '../setup';
import { HistoryItem } from '../api';

import c from '../index.m.scss';

function timeFormat(timeStamp: number): string {
  const date = new Date(timeStamp);
  const minutes = date.getMinutes();
  let hours = date.getHours();
  let minutesStr = '00';
  if (minutes > 46) {
    hours += 1;
  } else if (minutes > 16) {
    minutesStr = '30';
  }
  return `${String.prototype.padStart.call(hours, 2, '0')}:${minutesStr}`;
}
interface Props {
  item: HistoryItem
  refreshCount: number
  settings: Settings
  refPrevTimeStr: React.MutableRefObject<string>
}
const Label = ({
  item, settings, refreshCount, refPrevTimeStr,
}: Props) => {
  const [timeFormatted, setTimeFormatted] = useState<string>('');
  const refVisitTime = useRef<number>();
  const refRefreshCount = useRefVal(refreshCount);

  const timeStr = useMemo(() => {
    // 这是由 timeUpdMap 触发的事件
    if (timeFormatted !== '' && refRefreshCount.current === refreshCount) {
      return timeFormatted;
    }

    // refreshCount改变事件会被优先处理
    // 以下是 refreshCount 改变事件，refreshCount改变事件只有Section组件整个刷新才会出现
    // 只有label.visitCount大于1时，并且visitInfo还在请求中才会是undefined
    if (item.visitTime === undefined) return '';

    let rst;
    if (new Date().valueOf() - 3 * HOUR < item.visitTime) {
      rst = settings.timeAgoFormat(item.visitTime);

      // 加入监听队列每秒更新一次时间
      if (item.visitTime !== refVisitTime.current && refPrevTimeStr.current !== rst) {
        // 从监听队列删除上次绑定
        if (refVisitTime.current !== undefined) {
          settings.timeUpdMap.delete(refVisitTime.current);
        }

        // 加入监听队列
        settings.timeUpdMap.set(item.visitTime, {
          timeFormatted: rst,
          setTimeFormatted,
          recordTime: item.visitTime,
          title: item.title,
        });
        refVisitTime.current = item.visitTime;
      }
    } else {
      rst = timeFormat(item.visitTime);
    }
    // 减少重复
    if (refPrevTimeStr.current !== rst) {
      // FIXME: OOP
      // eslint-disable-next-line no-param-reassign
      refPrevTimeStr.current = rst;
      return rst;
    }
    return '';
  }, [
    item.title,
    item.visitTime,
    refPrevTimeStr,
    refRefreshCount,
    refreshCount,
    settings,
    timeFormatted,
  ]);

  useEffect(() => () => {
    if (refVisitTime.current !== undefined) {
      settings.timeUpdMap.delete(refVisitTime.current);
    }
  }, [settings.timeUpdMap]);
  return (
    <li className={c.label}>
      <div
        role="presentation"
        className={c['unit-tab']}
        onClick={() => settings.openLabel(item.url)}
      >
        <img
          src={
            item.url !== ''
              ? `chrome://favicon/size/18@2x/${item.url}`
              : defaultIcon
          }
          alt="favicon"
        />
        <a href={item.url} onClick={preventDefault}>
          {item.title === '' ? item.url : item.title}
        </a>
      </div>
      {
        timeStr !== ''
        && (
          <div className={c.time}>
            {
              timeStr
            }
          </div>
        )
      }
    </li>

  );
};

export default memo(Label);
