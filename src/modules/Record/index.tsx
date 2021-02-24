/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-01-11 10:11:06
 * @LastEditTime: 2021-02-24 14:39:16
 * @Description: file content
 */
import React from 'react';
import RecordList from './components/RecordList';
import useCC from './setup';

import c from './index.m.scss';

const Record = (): JSX.Element => {
  const { state, settings } = useCC();

  return (
    <div className={c.content}>
      <div className={c.title}>
        <div>RECORD</div>
        <div />
      </div>
      <div className={c.list}>
        {state.recording.map((v, i) => (
          <RecordList
            key={v.recordTime.valueOf()}
            recordingIndex={i}
            recording={v}
            settings={settings}
          />
        ))}
      </div>
    </div>
  );
};

export default Record;
