export enum AdvertisementActionKind {
  TITLE = 'TITLE',
  CONTENT = 'CONTENT',
  LINK = 'LINK',
  REGEXP = 'REGEXP',
  IS_PUBLISH = 'IS_PUBLISH',
  IS_ON_LIST_PAGE = 'IS_ON_LIST_PAGE',
  IS_ON_SEARCH_PAGE = 'IS_ON_SEARCH_PAGE',
  IS_ON_MAIN_PAGE = 'IS_ON_MAIN_PAGE',
  IS_ON_FILTER_PAGE = 'IS_ON_FILTER_PAGE',
  PRIORITY = 'PRIORITY',
  SELECTED_NEWS = 'SELECTED_NEWS',
  MEDIA_ID = 'MEDIA_ID',
}
interface ReducerState {
  title: string;
  content: string;
  link: string;
  is_publish: boolean;
  is_list_page: boolean;
  is_search_page: boolean;
  is_main_page: boolean;
  is_filter_page: boolean;
  priority: string;
  regExp: string;
  new: any;
  image_id: string;
}
interface Action {
  type: AdvertisementActionKind;
  payload: any;
}

export function advertisementReducer(state: ReducerState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case AdvertisementActionKind.TITLE:
      return { ...state, title: payload };
    case AdvertisementActionKind.CONTENT:
      return { ...state, content: payload };
    case AdvertisementActionKind.LINK:
      return { ...state, link: payload };
    case AdvertisementActionKind.REGEXP:
      return { ...state, regExp: payload };
    case AdvertisementActionKind.IS_PUBLISH:
      return { ...state, is_publish: payload };
    case AdvertisementActionKind.IS_ON_LIST_PAGE:
      return { ...state, is_list_page: payload };
    case AdvertisementActionKind.IS_ON_SEARCH_PAGE:
      return { ...state, is_search_page: payload };
    case AdvertisementActionKind.IS_ON_MAIN_PAGE:
      return { ...state, is_main_page: payload };
    case AdvertisementActionKind.IS_ON_FILTER_PAGE:
      return { ...state, is_filter_page: payload };
    case AdvertisementActionKind.PRIORITY:
      return { ...state, priority: payload };
    case AdvertisementActionKind.SELECTED_NEWS:
      return { ...state, new: payload };
    case AdvertisementActionKind.MEDIA_ID:
      return { ...state, image_id: payload };
    default:
      return state;
  }
}
