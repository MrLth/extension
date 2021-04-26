/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-04-26 16:31:32
 * @Description: file content
 */
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const render = (Component: React.FC) => {
  ReactDOM.render(
    <Component />,
    document.getElementById('root'),
  );
};

render(App);

// // ReactDOM.render(
// //     <App />,
// //     document.getElementById('root')
// // )

// if ((module as any).hot) {
//     // 接受模块的更新，并更新页面中的内容
//     (module as any).hot.accept('./App', () => {
//         render(App)
//     })
// }
