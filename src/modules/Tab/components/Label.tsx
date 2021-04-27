import React, { memo, useEffect, useState } from 'react';
import { loop, moduleClassnames, preventDefault } from 'utils';
import IconFont from 'components/IconFont';
import defaultIcon from '@img/defaultIcon.svg';
import { useDrop, useDrag } from 'ahooks';
import { isNumber, pick } from 'lodash-es';
import { Settings } from '../setup';
import c from '../index.m.scss';
import { MyTab } from '../model/type';

const cn = moduleClassnames(c);

function getLabelDom(dom: HTMLElement): HTMLElement {
  if (dom === document.body) return null;
  if (dom.tagName.toLowerCase() === 'li') return dom;
  return getLabelDom(dom.parentElement);
}

interface Props {
  tab: MyTab
  settings: Settings
  selectedTabs: Set<MyTab>
  updateKey: number
  top: number
}

function Label(
  {
    tab,
    settings,
    updateKey,
    selectedTabs,
  }: Props,
) {
  $log({ Label: tab.title, tab }, 'render', 5);

  function onMouseUpCapture(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    e.preventDefault();
    // right click
    if (e.button === 2) {
      const dom = getLabelDom(e.target as HTMLElement);

      const {
        bottom, left, top, width,
      } = dom.getBoundingClientRect();

      $log({
        target: e.target, dom, left, clientX: e.clientX,
      })

      settings.updPopupFrameProps(
        {
          isShow: true,
          top: bottom,
          left: e.clientX - left,
          targetTop: top,
          width,
          options: [
            // {
            //   title: '取消',
            //   icon: <IconFont type="iconcancel1f" />,
            //   cb: () => settings.updPopupFrameProps({ isShow: false }),
            // },
            {
              title: '记录',
              icon: <IconFont type="iconrecord_on" />,
              cb: () => settings.recordTab(tab),
            },
            // {
            //   title: '休眠',
            //   icon: <IconFont type="iconsleepmode" />,
            //   cb: () => console.log(3),
            // },
            // {
            //   title: '分组',
            //   icon: <IconFont type="icongit-merge-line" />,
            //   cb: () => console.log(4),
            // },
          ],
        },
      );
    }
  }

  const getDragProps = useDrag({
    onDragEnd: settings.hideDragHover,
  });
  const [dropProps, { isHovering }] = useDrop({
    onUri: (uri, e) => {
      alert(`uri: ${uri} dropped`);
    },
    onDom: (content: string) => {
      const sourceTabId = JSON.parse(content)?.tabId
      if (isNumber(sourceTabId)) {
        settings.handleDrop(sourceTabId, pick(tab, ['index', 'windowId']))
      }
    },
  });

  useEffect(() => {
    if (isHovering) {
      settings.updateDragHoverTop(tab)
    }
  }, [isHovering, settings, tab])

  return (
    <li
      data-upd-time={updateKey}
      style={{ ...tab.position }}
      className={cn('label', {
        activated: tab.active,
        'label-selected': selectedTabs.has(tab),
      })}
      // #region 右键事件
      onMouseUpCapture={onMouseUpCapture}
      onContextMenu={preventDefault}
      // #endregion
      {...getDragProps(JSON.stringify({
        tabId: tab.id,
      }))}
      {...dropProps}
    >
      <div
        role="presentation"
        className={c['unit-tab']}
        onClick={(e) => {
          e.stopPropagation();
          $log({ shiftKey: e.shiftKey, ctrlKey: e.ctrlKey })
          if (e.shiftKey) {
            settings.selectTab(tab)
          } else {
            settings.openTab(tab);
          }
        }}
        onMouseDown={(e) => {
          // middle button clicked
          if (e.button === 1) {
            settings.closeTab(tab.id);
          }
        }}
      >
        <img
          src={
            tab.url !== ''
              ? `chrome://favicon/size/18@2x/${tab.url}`
              : defaultIcon
          }
          alt={tab.url}
        />
        {/* 使用 a 标签无法阻止 mac os 上的 MiddleClick-catalina 工具的 触摸板三指轻触 模拟 鼠标中键点击 的默认行为，
              即中键点击一个 a 标签会新建一个标签页。所以这里使用 aria 尽量模拟 a 标签的行为
          */}
        <span
          role="link"
          tabIndex={0}
          data-href={tab.url}
          onClick={preventDefault}
          onKeyDown={loop}
        >
          {tab.title}
        </span>
      </div>

      <div className={c['btn-close']}>
        <IconFont
          type="iconclose"
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            settings.closeTab(tab.id);
          }}
        />
      </div>
    </li>
  );
}

export default memo(Label);
