import reducer, { RecordState } from './reducer'

type TypeDescriptor = {
	type: string
	module?: string
	reducerModule?: string
}

type RecordDispatch = (
	type: keyof typeof reducer | TypeDescriptor,
	payload?: any,
	renderKey?: string,
	delay?: number
) => Promise<object | undefined>

export default {
    // 所有归属于record cc下的组件被销毁时触发，目前Tab及Record组件归属于其，Record组件销毁时也有设置。
    // 因为两个组件不可能同时被销毁，所以不会有机会被触发。
    // 注意：页面刷新和关闭时不会触发
	willUnmount(dispatch: RecordDispatch) {
		dispatch('save')
	},
}
