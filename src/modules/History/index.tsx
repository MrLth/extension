/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 23:12:19
 * @Description: file content
 */
import React from 'react';
import { EmptyObject } from 'utils/type';
import { NoMap, useConcent } from 'concent';

import Section from './components/Section';
import c from './index.m.scss';
import {
  initState, moduleName, setup, connect, Ctx,
} from './setup';

const History = (): JSX.Element => {
  const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({
    module: moduleName, setup, state: initState, connect,
  });
  // console.log('history render')
  return (
    <div className={c.content}>
      <div className={c.title}>
        <div>HISTORY</div>
        <div>
          {/* <IconFont type='iconadd' onClick={settings.test1}></IconFont> */}
        </div>
      </div>
      <ul
        ref={settings.refList}
        className={c.list}
        style={{ position: 'relative' }}
        onScroll={settings.scrollCb}
      >
        {
          state.historySectionList.map((section) => (
            <Section
              key={section.index}
              // endTime={section.endTime}
              top={section.top}
              status={section.status}
              section={section}
              settings={settings}
            />
          ))
        }
      </ul>
    </div>
  );
};

export default History;
