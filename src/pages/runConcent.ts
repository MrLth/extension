/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-11-11 07:59:07
 * @LastEditTime: 2020-12-17 00:48:52
 * @Description: file content
 */
import { run } from 'concent';
import * as models from 'models';
import { debug } from 'utils';
import { cloneDeep } from 'lodash-es';

run(models, {
  middlewares: [
    (midCtx, next) => {
      const ctx = cloneDeep(midCtx);
      if (ctx.calledBy === 'dispatch') {
        debug({
          title: `${ctx.module} / ${ctx.type}`,
          // para: { ctx },
          multi: {
            payload: ctx.payload,
            ...ctx.committedState,
          },
        });
      } else {
        debug({
          title: `${ctx.module} ${ctx.calledBy}`,
          // para: ctx,
          multi: {
            ...ctx.committedState,
          },
          color: 1,
        });
      }

      next();
    },
  ],
});
