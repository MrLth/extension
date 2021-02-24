import React, { memo } from 'react';
import { moduleClassnames } from 'utils';
import { Tab } from 'utils/type';
import IconFont from 'components/IconFont';
import defaultIcon from '@img/defaultIcon.svg';
import { Settings } from '../setup';

import c from '../index.m.scss';

const cn = moduleClassnames.bind(null, c);

interface Props {
  tab: Tab
  settings: Settings
  updateKey: number
  windowUpdKey: number
}

const getLabelDom = (dom: HTMLElement): HTMLElement => {
  if (dom === document.body) return null;
  if (dom.tagName.toLowerCase() === 'li') return dom;
  return getLabelDom(dom.parentElement);
};

const Label = ({
  tab, settings, updateKey, windowUpdKey,
}: Props) => {
  $log({ Label: tab.title, tab }, 'render', 5);

  return (
    <li
      role="presentation"
      data-upd-time={updateKey}
      data-window-upd-time={windowUpdKey}
      className={cn('label', {
        activated: tab.active,
      })}
      onClick={(e) => {
        e.stopPropagation();
        settings.openTab(tab);
      }}
      // #region 右键事件
      onMouseUpCapture={(e) => {
        e.preventDefault();
        if (e.button === 2) {
          const dom = getLabelDom(e.target as HTMLElement);
          const {
            bottom, left, right, top,
          } = dom.getBoundingClientRect();
          settings.updPopupFrameProps(
            {
              isShow: true,
              top: bottom,
              left: e.clientX,
              targetTop: top,
              minLeft: left,
              maxRight: right,
              options: [
                {
                  title: '取消',
                  icon: <IconFont type="iconcancel1f" />,
                  cb: () => settings.updPopupFrameProps({ isShow: false }),
                },
                {
                  title: '记录',
                  icon: <IconFont type="iconrecord_on" />,
                  cb: () => console.log(2),
                },
                {
                  title: '休眠',
                  icon: <IconFont type="iconsleepmode" />,
                  cb: () => console.log(3),
                },
                {
                  title: '分组',
                  icon: <IconFont type="icongit-merge-line" />,
                  cb: () => console.log(4),
                },
              ],
            },
          );
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className={c['unit-tab']}>
        <img
          src={
            tab.url !== ''
              ? `chrome://favicon/size/18@2x/${tab.url}`
              : defaultIcon
          }
          alt={tab.url}
        />
        {tab.title}
      </div>
      <div className={c['btn-close']}>
        <IconFont
          type="iconclose"
          onClick={(e: MouseEvent) => {
            settings.closeTab(tab.id);
            e.stopPropagation();
          }}
        />
      </div>
    </li>
  );
};

export default memo(Label);
