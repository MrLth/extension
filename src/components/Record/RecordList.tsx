/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 00:54:14
 * @Description: file content
 */
import React, { memo, useEffect, useState } from 'react';
// #region 样式绑定
import { moduleClassnames } from 'utils';
// #endregion

import { Recording } from 'components/Record/model/state';
import IconFont from 'components/IconFont';
import { useRefVal } from 'utils/hooks';
import Label from './Label';
import { Settings } from '.';
import c from './index.module.scss';

const cn = moduleClassnames.bind(null, c);
interface Props {
  recordingIndex: number
  recording: Recording
  settings: Settings
}

const RecordList = ({ recordingIndex, recording, settings }: Props) => {
  const recordingIndexRef = useRefVal(recordingIndex);
  // #region 时间更新
  const [timeFormatted, setTimeFormatted] = useState<string>(
    () => settings.timeAgo.format(recording.recordTime),
  );
  useEffect(() => {
    settings.timeUpdQueue.push({
      timeFormatted,
      setTimeFormatted,
      recordTime: recording.recordTime,
    });

    return () => {
      const i = settings.timeUpdQueue.findIndex((v) => v.recordTime === recording.recordTime);
      if (i === -1) return;
      settings.timeUpdQueue.splice(i, 1);
    };
  }, [recording.recordTime, settings.timeUpdQueue, timeFormatted]);
  // #endregion

  return (
    <ul
      className={cn()}
    >
      <div className={cn('record-title')}>
        <div>{timeFormatted}</div>
        <div className={c['btn-close']}>
          <IconFont
            type="iconclose"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              settings.closeRecord(recordingIndex);
            }}
          />
        </div>
      </div>
      {recording.urls.map((v, i) => (
        <Label
          recordingIndexRef={recordingIndexRef}
          labelIndex={i}
          key={v.url}
          recordUrl={v}
          settings={settings}
        />
      ))}
    </ul>
  );
};

export default memo(RecordList);
