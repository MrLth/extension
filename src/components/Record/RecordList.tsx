import React, { memo, useEffect, useState } from 'react'
//#region 样式绑定
import c from './index.module.scss'
import { moduleClassnames } from 'api'
const cn = moduleClassnames.bind(null, c)
//#endregion

import { Recording } from 'models/record/state'
import Label from './Label'
import { Settings } from '.'
import IconFont from 'components/IconFont'
import { useRefVal } from 'hooks'
interface Props {
    recordingIndex: number
    recording: Recording
    settings: Settings
}

const RecordList = ({ recordingIndex, recording, settings }: Props) => {
    const recordingIndexRef = useRefVal(recordingIndex)
    //#region 时间更新
    const [timeFormatted, setTimeFormatted] = useState<string>(() => settings.timeAgo.format(recording.recordTime))
    useEffect(() => {
        settings.timeUpdQueue.push({
            timeFormatted,
            setTimeFormatted,
            recordTime: recording.recordTime
        })

        return () => {
            const i = settings.timeUpdQueue.findIndex(v => v.recordTime === recording.recordTime)
            if (i === -1) return
            settings.timeUpdQueue.splice(i, 1)
        }
    }, [])
    //#endregion

    console.log('RecordList Render')
    return (
        <ul
            className={cn()}>
            <div className={cn("record-title")}>
                <div>{timeFormatted}</div>
                <div className={c['btn-close']}>
                    <IconFont
                        type='iconclose'
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation()
                            settings.closeRecord(recordingIndex)
                        }}
                    />
                </div>
            </div>
            {recording.urls.map((v, i) => <Label
                recordingIndexRef={recordingIndexRef}
                labelIndex={i}
                key={v.url}
                recordUrl={v}
                settings={settings} />)}
        </ul>
    )
}

export default memo(RecordList)
