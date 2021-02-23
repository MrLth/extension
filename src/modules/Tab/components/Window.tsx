/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-17 08:05:07
 * @LastEditTime: 2021-02-23 10:51:50
 * @Description: file content
 */
import React, { memo } from 'react';
import { moduleClassnames } from 'utils';
import { MyWindow } from '../model/type';
import { Settings } from '../setup';
import Label from './Label';
import c from '../index.m.scss';

const cn = moduleClassnames.bind(null, c);

interface Props {
  myWindow: MyWindow
  settings: Settings
  updateKey: number
}

const Window = ({ myWindow, settings, updateKey }: Props) => {
  const { tabs, attach } = myWindow;
  const tabArr = [];

  const len = tabs.length;
  let nextHost: string | number; let
    host: string | number;

  for (let i = 0; i < len; i += 1) {
    let tab = tabs[i];
    let nextTab = i + 1 !== len && tabs[i + 1];

    const tempArr = [];
    const key = tab.id;

    nextHost = nextTab.urlInfo?.host ?? NaN;
    host = tab.urlInfo?.host ?? NaN;

    if (nextHost === host) {
      do {
        tempArr.push(
          <Label
            key={tab.id}
            tab={tab}
            updateKey={tab.updateKey}
            windowUpdKey={updateKey}
            settings={settings}
          />,
        );
        i += 1;
        tab = nextTab;
        nextTab = i + 1 !== tabs.length && tabs[i + 1];

        host = nextHost;
        nextHost = nextTab.urlInfo?.host ?? NaN;
      } while (i + 1 < len && nextHost === host);
    }

    tempArr.push(
      <Label
        key={tab.id}
        tab={tab}
        updateKey={tab.updateKey}
        windowUpdKey={updateKey}
        settings={settings}
      />,
    );

    tabArr.push(
      tempArr.length === 1 ? (
        tempArr
      ) : (
        <div className={c['tab-group']} key={key}>
          {tempArr}
        </div>
      ),
    );
  }
  log({ Window: attach.id, myWindow }, 'render', 5);
  return (
    <ul
      className={cn('window', {
        focused: attach?.focused,
      })}
    >
      <div className={cn('window-title')}>
        window #
        {attach?.id}
      </div>
      {tabArr}
    </ul>
  );
};

export default memo(Window);
