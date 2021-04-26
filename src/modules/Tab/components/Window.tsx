/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-17 08:05:07
 * @LastEditTime: 2021-04-26 16:27:41
 * @Description: file content
 */
import React, { memo, useEffect } from 'react';
import { moduleClassnames } from 'utils';
import { Tab } from 'utils/type';
import IconFont from 'components/IconFont';
import { useDrop } from 'ahooks';
import { isNumber } from 'lodash-es';
import { MyWindow } from '../model/type';
import { Settings } from '../setup';
import Label from './Label';
import c from '../index.m.scss';

const cn = moduleClassnames(c);

interface Props {
  myWindow: MyWindow
  settings: Settings
  selectedTabs: Set<Tab>
  updateKey: number
}

const Window = ({ myWindow, settings, selectedTabs }: Props) => {
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
            selectedTabs={selectedTabs}
            // windowUpdKey={updateKey}
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
        selectedTabs={selectedTabs}
        // windowUpdKey={updateKey}
        settings={settings}
      />,
    );

    tabArr.push(
      tempArr.length === 1 ? (
        tempArr
      ) : (
        <li
          className={c['tab-group']}
          key={key}
        >
          <ul>
            {tempArr}
          </ul>
        </li>
      ),
    );
  }

  const [dropProps, { isHovering }] = useDrop({
    onUri: (uri, e) => {
      alert(`uri: ${uri} dropped`);
    },
    onDom: (content: string) => {
      const sourceTabId = JSON.parse(content)?.tabId
      if (isNumber(sourceTabId)) {
        settings.handleDrop(sourceTabId, { index: 0, windowId: attach.id })
      }
    },
  });

  useEffect(() => {
    if (isHovering) {
      settings.updateDragHoverTop(null, attach.id)
    }
  }, [attach.id, isHovering, settings])

  $log({ Window: attach.id, myWindow }, 'render', 5);
  return (
    <li
      className={cn({
        focused: attach?.focused,
      })}
    >
      <header
        className={cn('window-title')}
        {...dropProps}
      >

        <h3>
          window #
          {attach.id}
        </h3>
        <div className={c.buttons}>
          <IconFont
            type="iconrecord_on"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              settings.recordWindow(attach.id)
            }}
          />
          <IconFont
            type="iconclose"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              settings.closeWindow(attach.id)
            }}
          />
        </div>
      </header>
      <ul>
        {tabArr}
      </ul>
    </li>
  );
};

export default memo(Window);
