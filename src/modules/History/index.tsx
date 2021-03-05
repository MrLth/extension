/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-03-05 14:54:49
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
    <section className={c.content}>
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
    </section>
  );
};

export default History;
