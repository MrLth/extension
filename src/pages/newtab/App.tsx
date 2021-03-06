/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-03-07 02:41:41
 * @Description: file content
 */
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash-es';
import { useConcent } from 'concent';
// import { hot } from 'react-hot-loader/root';

import 'normalize.css/normalize.css';
import 'pages/index.scss';

import '../../models/run';
import History from 'modules/History';
import Bookmark from 'modules/Bookmark';
import Record from 'modules/Record';
import { moduleClassnames } from 'utils';
import IconFont from 'components/IconFont';
import c from './index.m.scss'
import Tab from '../../modules/Tab';

const cn = moduleClassnames(c);

function App(): JSX.Element {
  const { setState } = useConcent('$$global');

  const [isHide, setIsHide] = useState(false)

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
      <div className={cn('part', 'bookmark')}><Bookmark /></div>
      <div className={cn('part', {
        'hidden-record': isHide,
      })}
      >
        <div className={c.tab}><Tab /></div>
        <div className={c.record}>
          <div className={c.arrow}>
            {
              isHide
                ? (
                  <IconFont
                    type="iconArrow-up"
                    onClick={() => setIsHide(false)}
                  />
                )
                : (
                  <IconFont
                    type="iconArrow-down"
                    onClick={() => setIsHide(true)}
                  />
                )
            }
          </div>
          <Record />

        </div>
      </div>
      <div className={c.part}><History /></div>

    </>
  );
}

// export default hot(App);
export default App;
