import { BOOKMARK_ACTION, BookmarkTreeNode ,BookmarkAction} from "./type";

export function bookmarkActionInit(tree: BookmarkTreeNode[]): BookmarkAction{
    return {
        type: BOOKMARK_ACTION.INIT,
        payload: tree,
    }
}