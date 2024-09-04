export enum RssActionKind {
  URL = 'URL',
  NAME = 'NAME',
  HAS_TITLE = 'HAS_TITLE',
  HAS_CONTENT = 'HAS_CONTENT',
  HAS_AUTHOR = 'HAS_AUTHOR',
  HAS_PUB_DATE = 'HAS_PUB_DATE',
  IS_ACTIVE = 'IS_ACTIVE',
  IMPORT_INTERVAL = 'IMPORT_INTERVAL',
  TAGS = 'TAGS',
}
interface ReducerState {
  url: string;
  name: string;
  has_title: boolean;
  has_content: boolean;
  has_author: boolean;
  has_pub_date: boolean;
  is_active: boolean;
  import_interval: string;
  tags: any[];
}
interface Action {
  type: RssActionKind;
  payload: any;
}

export function rssReducer(state: ReducerState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case RssActionKind.URL:
      return { ...state, url: payload };
    case RssActionKind.NAME:
      return { ...state, name: payload };
    case RssActionKind.HAS_TITLE:
      return { ...state, has_title: payload };
    case RssActionKind.HAS_CONTENT:
      return { ...state, has_content: payload };
    case RssActionKind.HAS_AUTHOR:
      return { ...state, has_author: payload };
    case RssActionKind.HAS_PUB_DATE:
      return { ...state, has_pub_date: payload };
    case RssActionKind.IS_ACTIVE:
      return { ...state, is_active: payload };
    case RssActionKind.IMPORT_INTERVAL:
      return { ...state, import_interval: payload };
    case RssActionKind.TAGS:
      return { ...state, tags: payload };
    default:
      return state;
  }
}
