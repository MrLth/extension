import * as React from 'react'
import { memo } from 'react'

//#region 样式绑定
import c from './index.module.scss'
import { moduleClassnames } from 'api'
import { RecordUrl } from 'models/record/state'
const cn = moduleClassnames.bind(null, c)
//#endregion
import defaultIcon from '@img/defaultIcon.svg'
import IconFont from 'components/IconFont'


interface Props {
    recordUrl: RecordUrl
}

const Label = ({ recordUrl }: Props) => {

    return (
        <li className={cn('label')}>
        <div className={c['unit-tab']}>
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
                    onClick={(e: MouseEvent) => {}}
                />
            </div>
        </li>
    )
}

export default memo(Label)
