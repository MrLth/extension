/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 17:30:01
 * @LastEditTime: 2021-04-24 16:44:39
 * @Description: 整个项目会用到的方法和api
 */

import { Key } from 'react';
import TimeAgo from 'javascript-time-ago';
import zh from 'javascript-time-ago/locale/zh';
import { isString } from 'lodash-es';
import { Fn, Keys, Obj } from './type';

TimeAgo.addLocale(zh);
const timeAgo = new TimeAgo('zh');
export const format = timeAgo.format.bind(timeAgo) as typeof timeAgo.format

export const type = (obj: unknown): string => (typeof obj !== 'object'
  ? typeof obj
  : Object.prototype.toString.call(obj).slice(8, -1).toLowerCase());

export const isLocal = (hostname: string): boolean => /^((127\.0\.0\.1)|(localhost)|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.((1[6-9])|(2\d)|(3[01]))\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3}))(:\d{0,5})?$/.test(
  hostname,
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const moduleClassnames = <T extends Record<string, string>>(module: T) => (
  ...paras: (keyof T | Partial<{ [P in keyof T]: boolean }>)[]
): string => {
  const classList = new Set<string>();

  for (const para of paras) {
    if (isString(para)) {
      classList.add(module[para]);
    } else {
      for (const [k, v] of Object.entries(para)) {
        if (v) classList.add(module[k])
      }
    }
  }

  return [...classList].join(' ');
}

export const sortByKey = <T>(key: keyof T, desc = false) => (
  a: T,
  b: T,
): number => {
  if (a[key] < b[key]) {
    return desc ? 1 : -1;
  }
  if (a[key] > b[key]) {
    return desc ? -1 : 1;
  }
  return 0;
};

export const queryStrToObj = (str: string): Record<string, string> => {
  const obj = {} as Record<string, string>

  if (typeof str !== 'string') return obj;

  const search = str.indexOf('?') !== -1 ? str.split('?')[1] : str;

  if (!search) return obj;

  for (const entry of search.split('&')) {
    const [k, v] = entry.split('=')
    if (k) obj[k] = v
  }

  return obj
};

interface ProxyMethods<T> {
  target: T
  handler: (target: Fn, thisArg: unknown, args: unknown[]) => unknown
  proxyKeys?: Keys
  ignoreKeys?: Keys
}

function allKeys<T>(obj: T): Keys {
  return Object.keys(Object.getOwnPropertyDescriptors(obj));
}

export function proxyMethods<T>({
  target,
  handler,
  proxyKeys,
  ignoreKeys,
}: ProxyMethods<T>): T {
  let keys: Keys = proxyKeys
  if (!keys) {
    if (typeof target.constructor === 'function') {
      // 1. 类的实例，方法从类原型上找

      keys = allKeys(Object.getPrototypeOf(target));

      const set = new Set(keys);
      set.delete('constructor');
      keys = Array.from(set);
    } else {
      // 2. 普通对象，仅遍历自身
      keys = allKeys(target as Obj);
    }
  }
  keys = keys.filter((k) => typeof (target as Obj)[k] === 'function');
  // 3. 去重 && 去除忽略键
  const set = new Set(keys);
  if (ignoreKeys) ignoreKeys.forEach((k) => set.delete(k));
  keys = Array.from(set);
  console.log('keys', keys);

  // 4. 为这些函数添加代理
  const fnMap = new Map<Key, Fn>();
  for (const k of keys) {
    const fn = (target as Obj)[k];
    if (typeof fn === 'function') {
      fnMap.set(
        k,
        new Proxy(fn, {
          apply(_target, thisArg, args) {
            handler(_target, thisArg, args);
            return _target.call(thisArg, ...args);
          },
        }),
      );
    }
  }
  // 5. 为对象添加代理，让方法函数的访问走代理
  return (new Proxy(target as Obj, {
    get(obj, k) {
      if (typeof k !== 'symbol') {
        return fnMap.has(k) ? fnMap.get(k) : obj[k];
      }
      return null
    },
  }) as unknown) as T;
}

export function preventDefault<T extends React.MouseEvent>(e: T): void {
  e.preventDefault()
}

export function loop():null {
  return null
}
