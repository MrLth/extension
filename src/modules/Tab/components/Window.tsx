/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-17 08:05:07
 * @LastEditTime: 2021-04-28 18:28:38
 * @Description: file content
 */
import React, { memo, useEffect } from 'react';
import { moduleClassnames, loop } from 'utils';
import IconFont from 'components/IconFont';
import { useDrop } from 'ahooks';
import { isNumber } from 'lodash-es';
import { MyWindow, MyTab, DisplayMode } from '../model/type';
import { Settings } from '../setup';
import Label from './Label';
import c from '../index.m.scss';

import DisplayModeTiled from './DM-tiled'
import DisplayModeTree from './DM-tree'

const cn = moduleClassnames(c);

interface Props {
  myWindow: MyWindow
  settings: Settings
  selectedTabs: Set<MyTab>
  updateKey: number
  position: MyWindow['position']
  displayMode: DisplayMode
}

function Window({
  myWindow, settings, selectedTabs, position, displayMode, updateKey,
}: Props) {
  const { tabs, attach } = myWindow;

  const [dropProps, { isHovering }] = useDrop({
    onUri: loop,
    onDom: (content: string) => {
      const sourceTabId = JSON.parse(content)?.tabId
      if (isNumber(sourceTabId)) {
        settings.handleDrop(sourceTabId, { index: -1, windowId: attach.id })
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
      className={cn('trans-top', {
        focused: attach?.focused,
      })}
      style={{ ...position }}
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
            type="icon-record"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              settings.recordWindow(attach.id)
            }}
          />
          <IconFont
            type="icon-close"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              settings.closeWindow(attach.id)
            }}
          />
        </div>
      </header>
      <ul>

        {
          displayMode !== 'tiled'
            ? (
              <DisplayModeTiled
                settings={settings}
                selectedTabs={selectedTabs}
                tabs={tabs}
                updateKey={updateKey}
              />
            )
            : (
              <DisplayModeTree
                settings={settings}
                selectedTabs={selectedTabs}
                tabs={tabs}
                updateKey={updateKey}
              />
            )
        }
      </ul>
    </li>
  );
}

export default memo(Window);
