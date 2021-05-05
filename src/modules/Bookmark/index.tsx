/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 08:34:51
 * @LastEditTime: 2021-05-05 15:52:20
 * @Description: file content
 */
import React, { useRef } from 'react';
import { moduleClassnames } from 'utils';
import BookmarkList from './components/BookmarkList';
import useCC from './setup'

import c from './index.m.scss';
import FolderNameList from './components/FolderNameList';
import ReferenceBox from './components/ReferenceBox';
import PiledOut from './components/PiledOut';

const cn = moduleClassnames(c);

const Bookmark = (): JSX.Element => {
  const { state, settings } = useCC()

  $log({ BookMark: 'BookMark' }, 'render', 5);

  const reactiveRef = useRef()

  return (
    <>
      <aside className={cn('content', 'content-left')}>
        <ul className={c['folder-list']} ref={reactiveRef}>
          <ReferenceBox reactiveRef={reactiveRef} />
          <FolderNameList
            folders={state.bookmarkTree?.folders}
            settings={settings}
          />
        </ul>
      </aside>
      <section className={cn('content')}>
        <BookmarkList ref={settings.refList} rootNode={state.bookmarkTree} settings={settings} />
      </section>
      <PiledOut />
    </>

  );
};

export default Bookmark;
