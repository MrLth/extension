/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-30 08:31:33
 * @LastEditTime: 2021-04-30 09:02:52
 * @Description: file content
 */
import { pick } from 'lodash-es'
import { linear } from './timing-function'

const constructorOptions = ['start', 'end', 'duration', 'timingFunction', 'updateCallback'] as const
type ConstructorOptions = typeof constructorOptions[number]

class Animation {
  start: number

  end: number

  duration: number

  timingFunction: (timing: number) => number

  range: number

  updateCallback: (value: number) => unknown

  constructor(options: Pick<Animation, ConstructorOptions>) {
    Object.assign(this, pick(options, constructorOptions))
    this.range = this.end - this.start
  }

  update(timing: number): number {
    const newValue = this.start + this.timingFunction(timing / this.duration) * this.range
    this.updateCallback.call(null, newValue)
    return newValue
  }
}

export default Animation
