/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-09-01 20:45:56
 * @LastEditTime: 2020-09-01 22:00:25
 * @Description: file content
 */
import { run } from 'concent'
import global from './global'

const storeConfig = {
    $$global: global
}

// const startupOption = {
//     middlewares: []
// }

run(storeConfig)
