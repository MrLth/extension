/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 00:52:28
 * @Description: file content
 */
import * as React from 'react';
import { memo } from 'react';

// #region 样式绑定
import { moduleClassnames } from 'utils';
import { RecordUrl } from 'components/Record/model/state';
// #endregion
import defaultIcon from '@img/defaultIcon.svg';
import IconFont from 'components/IconFont';
import c from './index.module.scss';
import { Settings } from '.';

const cn = moduleClassnames.bind(null, c);

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
