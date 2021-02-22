/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 23:43:29
 * @Description: file content
 */
import React, { memo, useEffect, useState } from 'react';
import { moduleClassnames } from 'utils';
import { useRefVal } from 'utils/hooks';
import IconFont from 'modules/IconFont';
import Label from './Label';
import { Recording } from '../model/state';
import { Settings } from '../setup';
import c from '../index.m.scss';

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