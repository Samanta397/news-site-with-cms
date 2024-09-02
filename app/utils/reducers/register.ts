export enum RegisterActionKind {
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
  ROLE = 'ROLE',
}
interface ReducerState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}
interface Action {
  type: RegisterActionKind;
  payload: string;
}

export function registerReducer(state: ReducerState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case RegisterActionKind.FIRST_NAME:
      return { ...state, first_name: payload };
    case RegisterActionKind.LAST_NAME:
      return { ...state, last_name: payload };
    case RegisterActionKind.EMAIL:
      return { ...state, email: payload };
    case RegisterActionKind.PASSWORD:
      return { ...state, password: payload };
    case RegisterActionKind.ROLE:
      return { ...state, role: payload };
    default:
      return state;
  }
}
