/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-23 09:35:55
 * @LastEditTime: 2021-02-23 09:59:50
 * @Description: file content
 */
import React from 'react';
import { NoMap, useConcent } from 'concent';
import { EmptyObject } from 'utils/type';
import Window from './components/Window';
import PopupFrame from '../PopupFrame';
import useViewable from './hooks/useViewable';
import c from './index.m.scss';
import {
  initState, moduleName, setup, connect, Ctx,
} from './setup';

const TabComponent = (): JSX.Element => {
  const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({
    module: moduleName, setup, state: initState, connect,
  });

  const { windows } = state.tabHandler ?? {};

  // 让当前活动标签可视
  const { listRef } = useViewable(state);

  log({ Tab: 'Tab' }, 'render', 5);
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
                // updateKey={v.updateKey}
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
