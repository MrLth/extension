/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-30 08:31:33
 * @LastEditTime: 2021-04-30 20:37:56
 * @Description: file content
 */
import { pick } from 'lodash-es'
import { ParametersPick } from 'utils/type'
import { linear } from './timing-function'

const requiredOptions = ['start', 'end', 'duration', 'timingFunction', 'updateCallback'] as const
const partialOptions = ['delay'] as const
const constructorOptions = [...requiredOptions, ...partialOptions] as const

type ConstructorOptions = ParametersPick<
  Animation,
  typeof requiredOptions[number],
  typeof partialOptions[number]
>

class Animation {
  start: number

  end: number

  duration: number

  delay = 0

  timingFunction: (timing: number) => number

  range: number

  updateCallback: (value: number) => unknown

  constructor(options: ConstructorOptions) {
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
