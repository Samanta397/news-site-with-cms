export enum NewsActionKind {
  TITLE = 'TITLE',
  CONTENT = 'CONTENT',
  AUTHOR = 'AUTHOR',
  IS_PUBLISH = 'IS_PUBLISH',
  IS_HIDDEN = 'IS_HIDDEN',
  IMAGE_ID = 'IMAGE_ID',
  TAGS = 'TAGS',
}
interface ReducerState {
  title: string;
  content: string;
  author: string;
  is_publish: boolean;
  is_hidden: boolean;
  image_id: string;
  tags: any[];
}
interface Action {
  type: NewsActionKind;
  payload: any;
}

export function newsReducer(state: ReducerState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case NewsActionKind.TITLE:
      return { ...state, title: payload };
    case NewsActionKind.CONTENT:
      return { ...state, content: payload };
    case NewsActionKind.AUTHOR:
      return { ...state, author: payload };
    case NewsActionKind.IS_PUBLISH:
      return { ...state, is_publish: payload };
    case NewsActionKind.IS_HIDDEN:
      return { ...state, is_hidden: payload };
    case NewsActionKind.IMAGE_ID:
      return { ...state, image_id: payload };
    case NewsActionKind.TAGS:
      return { ...state, tags: payload };
    default:
      return state;
  }
}
