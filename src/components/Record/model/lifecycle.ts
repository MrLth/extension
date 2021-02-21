/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-22 00:51:21
 * @Description: file content
 */
import reducer, { RecordState } from './reducer';

type TypeDescriptor = {
  type: string
  module?: string
  reducerModule?: string
}

type RecordDispatch = (
  type: keyof typeof reducer | TypeDescriptor,
  payload?: unknown,
  renderKey?: string,
  delay?: number
) => Promise<Record<string, unknown> | undefined>

export default {
  // 所有归属于record cc下的组件被销毁时触发，目前Tab及Record组件归属于其，Record组件销毁时也有设置。
  // 因为两个组件不可能同时被销毁，所以不会有机会被触发。
  // 注意：页面刷新和关闭时不会触发
  willUnmount(dispatch: RecordDispatch): void {
    dispatch('save');
  },
};
