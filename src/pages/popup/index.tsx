/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-02-23 11:04:29
 * @Description: file content
 */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useConcent } from 'concent';
import { debounce } from 'lodash-es';

import 'normalize.css/normalize.css';
import 'pages/index.scss';

import 'models/run';

import Tab from 'modules/Tab';

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
    <>
      <div className="popup-wrapper" style={{ minHeight: `${4.9125 + 2 * 7}rem`, minWidth: 300 }}>
        <Tab />
      </div>
    </>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
