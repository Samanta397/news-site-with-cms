export enum LoginActionKind {
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
}
interface ReducerState {
  email: string;
  password: string;
}
interface Action {
  type: LoginActionKind;
  payload: string;
}

export function loginReducer(state: ReducerState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case LoginActionKind.EMAIL:
      return { ...state, email: payload };
    case LoginActionKind.PASSWORD:
      return { ...state, password: payload };
    default:
      return state;
  }
}
