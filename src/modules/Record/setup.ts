/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 23:35:20
 * @LastEditTime: 2021-02-24 12:59:58
 * @Description: file content
 */
import { SettingsType } from 'concent';
import { EmptyObject, Obj } from 'utils/type';
import { format } from 'utils';
import { CtxMSConn, ItemsType } from 'utils/type/concent';

export const moduleName = 'record';
export const connect = ['tab'] as const;
export const initState = ():Obj => ({});

type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>

interface TimeUpdItem {
  timeFormatted: string,
  setTimeFormatted: React.Dispatch<React.SetStateAction<string>>,
  recordTime: Date
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setup = (ctx: CtxPre) => {
  const { effect, reducer } = ctx;

  // 数据初始化
  effect(() => {
    // 状态初始化，包括从本地读取记录
    reducer.record.init();
    // 页面刷新或关闭时保存记录
    const beforeUnloadListener = () => {
      reducer.record.save(null);
    };
    window.addEventListener('beforeunload', beforeUnloadListener);
    return () => {
      // 组件销毁时触发，实际并没有实现销毁。所以暂时用不到
      // 注意：页面刷新和关闭时不会触发
      window.removeEventListener('beforeunload', beforeUnloadListener);
    };
  }, []);

  const settings = {
    closeLabel: reducer.record.closeLabel,
    closeRecord: reducer.record.closeRecord,
    openLabel: reducer.tab.openTab,
    timeUpdQueue: [] as TimeUpdItem[],
  };

  // 时间更新
  effect(() => {
    let timerId: number;
    const updRecordTimeFormatted = () => {
      timerId = window.setTimeout(() => {
        updRecordTimeFormatted();
        for (const v of settings.timeUpdQueue) {
          const timeFormatted = format(v.recordTime);
          if (timeFormatted !== v.timeFormatted) {
            v.setTimeFormatted(timeFormatted);
            v.timeFormatted = timeFormatted;
          }
        }
      }, 10000);
    };
    updRecordTimeFormatted();
    return () => {
      clearTimeout(timerId);
    };
  });

  return settings;
};

export type Settings = SettingsType<typeof setup>
export type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
