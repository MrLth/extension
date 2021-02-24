/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-23 09:35:55
 * @LastEditTime: 2021-02-24 14:31:08
 * @Description: file content
 */
import React from 'react';
import PopupFrame from 'components/PopupFrame';
import Window from './components/Window';
import useViewable from './hooks/useViewable';
import c from './index.m.scss';
import useCC from './setup';

const TabComponent = (): JSX.Element => {
  const { state, settings } = useCC()

  const { windows } = state.tabHandler ?? {};

  // 让当前活动标签可视
  const { listRef } = useViewable(state);

  $log({ Tab: 'Tab' }, 'render', 5);
  console.log('__DEV__', __DEV__);
  if (__DEV__) {
    console.log('this is development')
  } else {
    console.log('this is production')
  }

  return (
    <>
      <div className={c.content}>
        <div className={c.title}>
          <div>TAB</div>
          <div>
            {/* <IconFont
              type="iconjump_to_top"
              onClick={() => settings.recordAllTab()}
            />
            */}
          </div>
        </div>
        <div className={c.list} ref={listRef}>
          {
            windows && [...windows.entries()]
              .map(([k, v]) => (
                <Window
                  key={k}
                  myWindow={v}
                  settings={settings}
                  updateKey={v.updateKey}
                />
              ))
          }
        </div>
      </div>
      <PopupFrame {...state.popupFrameProps} />
    </>
  );
};

export default TabComponent;
