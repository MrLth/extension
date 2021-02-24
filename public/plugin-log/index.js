/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-23 14:15:23
 * @LastEditTime: 2021-02-24 11:44:23
 * @Description: file content
 */

module.exports = ({ types: t, template }) => ({
  pre() {
    this.modifiedNames = ['$log', '$debug']
    this.modulePath = './log'
  },
  visitor: {
    ImportDeclaration(path) {
      if (path.node.source.value === this.modulePath) {
        path.remove()
      }
    },
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee) && t.isExpressionStatement(path.container)) {
        const { name } = path.node.callee
        if (this.modifiedNames.includes(name)) {
          if (!this[name]) {
            this[name] = path.scope.generateUidIdentifier(name)
          }
          if (process.env && process.env.NODE_ENV === 'production') {
            path.remove()
          } else {
            const newNode = template('console.log()')()
            const callExpression = path.node
            callExpression.callee = this[name]
            const call = t.spreadElement(callExpression)
            newNode.expression.arguments.push(call)
            path.replaceWith(newNode)
          }
        }
      }
    },
  },
  post(state) {
    const specifiers = this.modifiedNames.filter((v) => this[v]).map((v) => `${v} as ${this[v].name}`).join(',')
    state.path.node.body.unshift(template.ast(`
    import {${specifiers}} from '${this.modulePath}'
  `))
  },
})
