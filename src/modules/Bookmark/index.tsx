/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 08:34:51
 * @LastEditTime: 2021-02-24 14:44:35
 * @Description: file content
 */
import React from 'react';
import FolderNameList from './components/FolderNameList';
import BookmarkList from './components/BookmarkList';
import useCC from './setup'

import c from './index.m.scss';

const Bookmark = (): JSX.Element => {
  const { state, settings } = useCC()

  $log({ BookMark: 'BookMark' }, 'render', 5);
  return (
    <div className={c.content}>
      <div className={c.title}>
        <div>BOOKMARK</div>
        <div />
      </div>
      <div className={c['list-wrapper']}>
        <FolderNameList folders={state.bookmarkTree?.folders} settings={settings} />
        <BookmarkList ref={settings.refList} rootNode={state.bookmarkTree} settings={settings} />
      </div>
    </div>
  );
};

export default Bookmark;
