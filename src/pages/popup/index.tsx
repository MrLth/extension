/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-05-08 11:29:21
 * @Description: file content
 */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useConcent } from 'concent';
import { debounce } from 'lodash-es';

import 'normalize.css/normalize.css';
import 'pages/index.scss';

import Tab from 'modules/Tab';
import c from './index.m.scss'

import 'models/run';

const App = () => {
  const { setState } = useConcent('$$global');

  useEffect(() => {
    const windowResizeListener = debounce(() => {
      setState({
        windowSize: {
          width: window?.innerWidth,
          height: window?.innerHeight,
        },
      });
    }, 300);
    window.addEventListener('resize', windowResizeListener);
    return () => {
      window.removeEventListener('resize', windowResizeListener);
    };
  }, [setState]);
  return (
    <div id="popup" className={c.popup}>
      <Tab />
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
