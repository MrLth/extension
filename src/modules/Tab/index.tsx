/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-23 09:35:55
 * @LastEditTime: 2021-04-28 14:58:05
 * @Description: file content
 */
import React, { useRef } from 'react';
import PopupFrame from 'components/PopupFrame';
import { useOnClickOutside } from 'use-hooks';
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

  const popFrameRef = useRef()
  useOnClickOutside(popFrameRef, () => {
    settings.updPopupFrameProps({ isShow: false })
  })

  return (
    <>
      <section className={c.content}>
        <div className={c['list-wp']}>
          <ul className={c.list} ref={listRef}>
            {
              windows && [...windows.entries()].map(([k, v]) => (
                <Window
                  key={k}
                  myWindow={v}
                  settings={settings}
                  selectedTabs={state.selectedTabs}
                  updateKey={v.updateKey}
                  position={v.position}
                  displayMode={state.displayMode}
                />
              ))
            }
          </ul>
        </div>
      </section>
      <PopupFrame {...state.popupFrameProps} ref={popFrameRef} />
      <div
        className={c['darg-hover']}
        style={{ top: state.dragHoverTop, display: state.dragHoverTop < 0 ? 'none' : 'block' }}
      />
    </>
  );
};

export default TabComponent;
