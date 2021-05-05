/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-11 14:57:20
 * @LastEditTime: 2021-05-05 22:54:24
 * @Description: file content
 */
import React, { useEffect, useState, useRef } from 'react';
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
import { LOCAL_KEY } from 'utils/const';
import c from './index.m.scss'
import Tab from '../../modules/Tab';

const cn = moduleClassnames(c);

function App(): JSX.Element {
  const { setState } = useConcent('$$global');

  const [isHide, setIsHide] = useState(
    () => Boolean(JSON.parse(localStorage.getItem(LOCAL_KEY.RecordIsHidden))),
  )

  function toggleIsHide() {
    const newIsHide = !isHide
    localStorage.setItem(LOCAL_KEY.RecordIsHidden, JSON.stringify(newIsHide))
    setIsHide(newIsHide)
  }

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

  const asideRef = useRef<HTMLDivElement>()
  const sectionRef = useRef<HTMLDivElement>()

  const [update, setUpdate] = useState(false)
  useEffect(() => {
    setUpdate(true)
  }, [])

  return (
    <>
      <div className={c.aside} ref={asideRef} />
      <div className={c.part} ref={sectionRef} />
      <Bookmark asideRef={asideRef} sectionRef={sectionRef} />
      {/* <div className={cn('part', 'bookmark')}><Bookmark /></div> */}
      <div className={cn('part', {
        'hidden-record': isHide,
      })}
      >
        <div className={c.tab}><Tab /></div>
        <div className={c.record}>
          <div className={c.arrow}>
            <span
              role="presentation"
              onClick={toggleIsHide}
            >
              <IconFont type={isHide ? 'icon-arrow-up' : 'icon-arrow-down'} />
            </span>

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
