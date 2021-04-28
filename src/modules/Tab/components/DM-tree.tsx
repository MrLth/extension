/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-28 14:48:18
 * @LastEditTime: 2021-04-28 22:59:00
 * @Description: file content
 */
import React, { memo } from 'react'
import { MyTab } from '../model/type'
import { Settings } from '../setup'
import Label from './Label'
import useTreeMode from '../hooks/useTreeMode'

interface Props {
  tabs: MyTab[]
  selectedTabs: Set<MyTab>
  settings: Settings
  updateKey: number
}

function DisplayModeTree({
  tabs, selectedTabs, settings, updateKey,
}: Props) {
  const structureItems = useTreeMode(tabs)
  return (
    <>
      {structureItems.map(([structure, tab]) => (
        <Label
          key={tab.id}
          tab={tab}
          updateKey={tab.updateKey}
          selectedTabs={selectedTabs}
          settings={settings}
          top={tab.position.top}
          structure={structure}
        />
      ))}
    </>
  )
}

export default DisplayModeTree
