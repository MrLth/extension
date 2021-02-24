/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-24 14:43:08
 * @Description: file content
 */
import React from 'react';
import Section from './components/Section';
import useCC from './setup';

import c from './index.m.scss';

const History = (): JSX.Element => {
  const { state, settings } = useCC()
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
