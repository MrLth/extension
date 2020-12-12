import * as React from 'react'
import { memo } from 'react'

//#region 样式绑定
import c from './index.module.scss'
import { moduleClassnames } from 'utils'
import { RecordUrl } from 'models/record/state'
const cn = moduleClassnames.bind(null, c)
//#endregion
import defaultIcon from '@img/defaultIcon.svg'
import IconFont from 'components/IconFont'
import { Settings } from '.'


interface Props {
    recordingIndexRef: React.MutableRefObject<number>
    labelIndex: number
    recordUrl: RecordUrl
    settings: Settings
}

const Label = ({ recordingIndexRef, labelIndex, recordUrl, settings }: Props) => {

    return (
        <li className={cn('label')}>
            <div
                className={c['unit-tab']}
                onClick={() => settings.openLabel(recordUrl.url)}>
                <img
                    src={
                        recordUrl.url !== ''
                            ? `chrome://favicon/size/18@2x/${recordUrl.url}`
                            : defaultIcon
                    }
                />
                {recordUrl.title}
            </div>
            <div className={c['btn-close']}>
                <IconFont
                    type='iconclose'
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                        settings.closeLabel({ recordingIndex: recordingIndexRef.current, labelIndex })
                    }}
                />
            </div>
        </li>
    )
}

export default memo(Label)
