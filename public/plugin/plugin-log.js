/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-23 14:15:23
 * @LastEditTime: 2021-02-23 23:42:09
 * @Description: file content
 */

module.exports = ({ types: t, template }) => ({
  visitor: {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'log' }) && t.isExpressionStatement(path.container)) {
        if (process.env.NODE_ENV !== 'production') {
          const e = template('console.log()')()
          const call = t.spreadElement(path.node)
          e.expression.arguments.push(call)
          path.replaceWith(e)
        } else {
          path.remove()
        }
      }
    },
  },
})
