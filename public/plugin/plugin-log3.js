/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-23 14:15:23
 * @LastEditTime: 2021-02-23 17:14:12
 * @Description: file content
 */

module.exports = ({ types: t, template }) => ({
  visitor: {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'log' })) {
        if (t.isExpressionStatement(path.container)) {
          if (process.env.NODE_ENV !== 'production') {
            const e = template('console.log()')()

            const call = t.spreadElement(path.node)
            e.expression.arguments.push(call)

            console.log(path)
            path.replaceWith(e)
          } else {
            path.remove()
          }
        }
      }
    },
  },
})
