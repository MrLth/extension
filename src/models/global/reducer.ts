import { WindowSize, ModuleState } from "./type"

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-09-01 21:04:43
 * @LastEditTime: 2020-09-01 21:47:32
 * @Description: file content
 */
export function updWindowSize(_windowSize: WindowSize, moduleState: ModuleState): unknown {
    console.log('moduleState', moduleState)
    return { ...moduleState, _windowSize }
}

export default {updWindowSize}
