/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-31 21:19:42
 * @LastEditTime: 2020-05-31 22:43:21
 * @Description: file content
 */
import { Tab, CustomProps } from '../../api/type'

export interface PopupState {
	storeTabs: Array<Tab & CustomProps>
}
