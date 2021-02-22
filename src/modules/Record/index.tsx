/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-01-11 10:11:06
 * @LastEditTime: 2021-02-22 23:41:03
 * @Description: file content
 */
import React from 'react';
import { NoMap, useConcent } from 'concent';
import { EmptyObject } from 'utils/type';
import RecordList from './components/RecordList';
import {
  initState, moduleName, setup, connect, Ctx,
} from './setup';

import c from './index.m.scss';

const Record = (): JSX.Element => {
  const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({
    module: moduleName, setup, state: initState, connect,
  });

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
