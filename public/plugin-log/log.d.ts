/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-24 11:34:54
 * @LastEditTime: 2021-02-24 11:53:31
 * @Description: file content
 */

declare function $log(
  val: unknown,
  title?: string,
  color?: number | string
): [string, ...unknown[]]

type DebugConfig = {
  color?: string | number
  title?: string
  para?: unknown
  multi?: Record<string, unknown>
  label?: string
}

declare function $debug(config: DebugConfig): [string, ...unknown[]]
