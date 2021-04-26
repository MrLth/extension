/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-23 09:35:55
 * @LastEditTime: 2021-04-26 16:36:57
 * @Description: file content
 */
import React from 'react';
import PopupFrame from 'components/PopupFrame';
import Window from './components/Window';
import useViewable from './hooks/useViewable';
import useCC from './setup';
import c from './index.m.scss';

const TabComponent = (): JSX.Element => {
  const { state, settings } = useCC()

  const { windows } = state.tabHandler ?? {};

  // 让当前活动标签可视
  const { listRef } = useViewable(state);

  $log({ Tab: 'Tab' }, 'render', 5);

  return (
    <>
      <section className={c.content}>
        <ul className={c.list} ref={listRef}>
          {
            windows && [...windows.entries()].map(([k, v]) => (
              <Window
                key={k}
                myWindow={v}
                settings={settings}
                selectedTabs={state.selectedTabs}
                updateKey={v.updateKey}
              />
            ))
          }
        </ul>
      </section>
      <PopupFrame {...state.popupFrameProps} />
      <div
        className={c['darg-hover']}
        style={{ top: state.dragHoverTop, display: state.dragHoverTop < 0 ? 'none' : 'block' }}
      />
    </>
  );
};

export default TabComponent;
