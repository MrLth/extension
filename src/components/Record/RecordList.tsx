import * as React from 'react'
import { memo } from 'react'
//#region 样式绑定
import c from './index.module.scss'
import { moduleClassnames } from 'api'
const cn = moduleClassnames.bind(null, c)
//#endregion
//#region Time Ago Init
import TimeAgo from 'javascript-time-ago'
import zh from 'javascript-time-ago/locale/zh'
TimeAgo.addLocale(zh)
const timeAgo = new TimeAgo('zh')
//#endregion
import { Recording } from 'models/record/state'
import Label from './Label'
interface Props {
    recording: Recording
}

const RecordList = ({ recording }: Props) => {
    return (
        <ul
            className={cn()}>
            <div className={cn("record-title")}>{timeAgo.format( recording.recordTime)}</div>
            {recording.urls.map(v => <Label key={v.url} recordUrl={v} />)}
        </ul>
    )
}

export default memo(RecordList)
