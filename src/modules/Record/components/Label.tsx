/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-24 16:44:03
 * @Description: file content
 */
import React, { memo } from 'react';
import { moduleClassnames } from 'utils';
import defaultIcon from '@img/defaultIcon.svg';
import IconFont from 'components/IconFont';
import { RecordUrl } from '../model/state';
import { Settings } from '../setup';

import c from '../index.m.scss';

const cn = moduleClassnames(c);

interface Props {
  recordingIndexRef: React.MutableRefObject<number>
  labelIndex: number
  recordUrl: RecordUrl
  settings: Settings
}

const Label = ({
  recordingIndexRef, labelIndex, recordUrl, settings,
}: Props) => (
  <li className={cn('label')}>
    <div
      role="presentation"
      className={c['unit-tab']}
      onClick={() => settings.openLabel(recordUrl.url)}
    >
      <img
        src={
          recordUrl.url !== ''
            ? `chrome://favicon/size/18@2x/${recordUrl.url}`
            : defaultIcon
        }
        alt={recordUrl.url}
      />
      {recordUrl.title}
    </div>
    <div className={c['btn-close']}>
      <IconFont
        type="iconclose"
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          settings.closeLabel({ recordingIndex: recordingIndexRef.current, labelIndex });
        }}
      />
    </div>
  </li>
);

export default memo(Label);
