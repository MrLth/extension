/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-02-21 23:32:47
 * @Description: file content
 */
import React, { useEffect } from 'react';
import { debounce } from 'lodash-es';
import { useConcent } from 'concent';
import { hot } from 'react-hot-loader/root';

import 'normalize.css/normalize.css';
import 'src/index.scss';

import '../runConcent';
import History from 'components/History';
import Bookmark from 'components/Bookmark';
import Tab from '../../components/Tab';

function App(): JSX.Element {
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
      <Bookmark />
      <Tab />
      <History />
    </>
  );
}

export default hot(App);
