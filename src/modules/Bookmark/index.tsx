/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 08:34:51
 * @LastEditTime: 2021-03-05 14:51:12
 * @Description: file content
 */
import React from 'react';
import { moduleClassnames } from 'utils';
import FolderNameList from './components/FolderNameList';
import BookmarkList from './components/BookmarkList';
import useCC from './setup'

import c from './index.m.scss';

const cn = moduleClassnames(c);

const Bookmark = (): JSX.Element => {
  const { state, settings } = useCC()

  $log({ BookMark: 'BookMark' }, 'render', 5);

  return (
    <>
      <aside className={cn('content', 'content-left')}>
        <FolderNameList folders={state.bookmarkTree?.folders} settings={settings} />
      </aside>
      <section className={cn('content')}>
        <BookmarkList ref={settings.refList} rootNode={state.bookmarkTree} settings={settings} />
      </section>
    </>

  );
};

export default Bookmark;
