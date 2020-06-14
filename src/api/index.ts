/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 17:30:01
 * @LastEditTime: 2020-06-14 20:30:23
 * @Description: 整个项目会用到的方法和api
 */
export function throttle(fn: (...args: unknown[]) => unknown, interval: number): (...args: unknown[]) => void {
    let lastTime: number = null
    return function (...args: unknown[]): void {
        const nowTime = +new Date()
        if (nowTime - lastTime > interval || !lastTime) {
            fn(...args)
            lastTime = nowTime
        }
    }
}

export function debound(
    fn: (...args: unknown[]) => unknown,
    delay: number
): (...args: unknown[]) => void {
    let timer: number = null
    return function (...args: unknown[]): void {
        clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

export function deboundFixed(
    fn: (...args: unknown[]) => unknown,
    delay: number,
    maxDelay = delay + 50
): (...args: unknown[]) => void {
    let timer: number = null
    let lastHandleTime = +new Date()
    return function (...args: unknown[]): void {
        clearTimeout(timer)
        const nowTime = +new Date()

        const cb = () => {
            lastHandleTime = nowTime
            fn.apply(this, args)
        }
        if (nowTime - lastHandleTime > maxDelay) {
            cb()
        } else {
            timer = setTimeout(cb, delay)
        }
    }
}
