/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-09 16:09:49
 * @LastEditTime: 2021-02-22 01:23:54
 * @Description: file content
 */

const DOMAIN_MERGE_TIME_INTERVAL = 1000 * 60 * 30; // 半个小时

export function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number {
  let l = array.length;
  while (l) {
    l -= 1
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

export interface HistoryItem extends chrome.history.HistoryItem {
  visitTime?: number
  isAddToQueue?: boolean
}
export interface DomainHistoryItem {
  domain: string
  list: HistoryItem[]
}
export function sortNativeHistory(
  nativeHistory: chrome.history.HistoryItem[],
): DomainHistoryItem[] {
  const domainHistoryList: DomainHistoryItem[] = [];

  for (const item of nativeHistory) {
    try {
      const url = new URL(item.url);
      const i = findLastIndex(domainHistoryList, (v) => v.domain === url.host);
      // 没找到 或者 已找到但是超过时间间隔，则新建一个DomainHistoryItem
      if (
        i === -1
        || domainHistoryList[i].list[0].lastVisitTime - item.lastVisitTime
        > DOMAIN_MERGE_TIME_INTERVAL
      ) {
        domainHistoryList.push({
          domain: url.host,
          list: [item],
        });
      } else {
        domainHistoryList[i].list.push(item);
      }
    } catch (e) {
      console.error('sortNativeHistory error', e);
    }
  }
  return domainHistoryList;
}

export function calcHeight(list: DomainHistoryItem[]): number {
  let h = 36;
  for (const item of list) {
    const len = item.list.length;
    h += len > 1 ? 8 + len * 28 : 32;
  }
  return h;
}
