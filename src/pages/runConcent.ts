/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-11-11 07:59:07
 * @LastEditTime: 2020-12-16 00:36:58
 * @Description: file content
 */
import { run } from 'concent'
import * as models from 'models'
import { debug } from 'utils'
import { cloneDeep } from 'lodash'

run(models, {
	middlewares: [
		(midCtx, next) => {
			log({ midCtx, midCtx1: midCtx , window}, 'mix')
			const ctx = cloneDeep(midCtx)
			if (ctx.calledBy === 'dispatch') {
				debug({
					title: `${ctx.module} / ${ctx.type}`,
					para: { ctx },
					multi: {
						payload: ctx.payload,
						nextState: ctx.committedState,
					},
				})
			} else {
				debug({
					title: `${ctx.module} ${ctx.calledBy}`,
					para: ctx,
					color: 1,
				})
			}

			next()
		},
	],
})
