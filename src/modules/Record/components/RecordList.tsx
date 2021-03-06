/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-03-07 02:24:30
 * @Description: file content
 */
import React, { memo, useEffect, useState } from 'react';
import { format, moduleClassnames } from 'utils';
import { useRefVal } from 'utils/hooks';
import IconFont from 'components/IconFont';
import Label from './Label';
import { Recording } from '../model/state';
import { Settings } from '../setup';
import c from '../index.m.scss';

const cn = moduleClassnames(c);
interface Props {
  recordingIndex: number
  recording: Recording
  settings: Settings
}

const RecordList = ({ recordingIndex, recording, settings }: Props) => {
  const recordingIndexRef = useRefVal(recordingIndex);
  // #region 时间更新
  const [timeFormatted, setTimeFormatted] = useState<string>(
    () => format(recording.recordTime),
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
    <li>
      <header className={cn('record-title')}>
        <h3>{timeFormatted}</h3>
        <div className={c['btn-close']}>
          <IconFont
            type="iconopen"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              settings.openAllTab(recording.urls)
            }}
          />
          <IconFont
            type="iconclose"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              settings.closeRecord(recordingIndex);
            }}
          />
        </div>
      </header>
      <ul>
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
    </li>
  );
};

export default memo(RecordList);
