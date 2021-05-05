/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 08:34:51
 * @LastEditTime: 2021-05-05 23:10:57
 * @Description: file content
 */
import React, { useRef, MutableRefObject } from 'react';
import { moduleClassnames } from 'utils';
import { createPortal } from 'react-dom';
import BookmarkList from './components/BookmarkList';
import useCC from './setup'

import c from './index.m.scss';
import FolderNameList from './components/FolderNameList';
import ReferenceBox from './components/ReferenceBox';
import PiledOut from './components/PiledOut';

const cn = moduleClassnames(c);

interface Props {
  asideRef: MutableRefObject<HTMLDivElement>,
  sectionRef: MutableRefObject<HTMLDivElement>
}
const Bookmark = ({ asideRef, sectionRef }: Props): JSX.Element => {
  const { state, settings } = useCC()

  $log({ BookMark: 'BookMark' }, 'render', 5);

  const reactiveRef = useRef()

  return (
    <>
      {asideRef.current && createPortal(
        <aside className={cn('content', 'content-left')}>
          <ul className={c['folder-list']} ref={reactiveRef}>
            <ReferenceBox reactiveRef={reactiveRef} />
            <FolderNameList
              folders={state.bookmarkTree?.folders}
              settings={settings}
            />
          </ul>
        </aside>,
        asideRef.current,
      )}
      {sectionRef.current && createPortal(
        <section className={cn('content')}>
          <BookmarkList ref={settings.refList} rootNode={state.bookmarkTree} settings={settings} />
        </section>,
        sectionRef.current,
      )}
      <PiledOut
        node={state.clickedFolder}
        settings={settings}
        asideRef={asideRef}
        sectionRef={sectionRef}
      />
    </>

  );
};

export default Bookmark;
