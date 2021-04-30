/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-30 09:03:55
 * @LastEditTime: 2021-04-30 20:41:04
 * @Description: file content
 */
import Animation from './Animation'

const TICK = Symbol('tick')
const TASKS = Symbol('tasks')
const TICK_HANDLER = Symbol('Tick handler')
const PAUSE_START = Symbol('Pause start')
const PAUSE_TIME = Symbol('Pause time')

class TimeLine {
  state: 'initd' | 'started' | 'paused'

  startTime: Date

  [TASKS]: Set<{ animation: Animation, startTime: number }>

  [TICK_HANDLER]: number

  [PAUSE_START]: number

  [PAUSE_TIME]: number

  constructor() {
    this.state = 'initd'
    this[TASKS] = new Set()
    this[TICK] = this[TICK].bind(this)
  }

  [TICK](): void {
    const now = Date.now()
    for (const task of this[TASKS]) {
      const { animation, startTime } = task

      if (startTime <= now) {
        let timing = now - startTime - this[PAUSE_TIME]

        if (timing > animation.duration) {
          this[TASKS].delete(task)
          timing = animation.duration
        }

        animation.update(timing)
      }
    }

    this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
  }

  start(): void {
    if (this.state !== 'initd') {
      return
    }
    this.state = 'started'
    this.startTime = new Date()
    this[PAUSE_TIME] = 0
    this[TICK]()
  }

  add(animation: Animation, delay = animation.delay ?? 0): TimeLine {
    this[TASKS].add({ animation, startTime: Date.now() + delay })
    return this
  }

  pause(): void {
    if (this.state !== 'started') {
      return
    }
    this.state = 'paused'
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume(): void {
    if (this.state !== 'paused') {
      return
    }
    this.state = 'started'
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset(): TimeLine {
    this.pause()
    this.state = 'initd'
    this.startTime = new Date()
    this[PAUSE_TIME] = 0
    this[PAUSE_START] = 0
    this[TICK_HANDLER] = null
    this[TASKS] = new Set()
    return this
  }
}

export default TimeLine
