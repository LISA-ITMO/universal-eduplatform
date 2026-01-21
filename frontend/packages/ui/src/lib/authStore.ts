type Subscriber = (s: AuthState) => void;

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  initializing?: boolean;
}

let state: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  initializing: true,
};

const subscribers = new Set<Subscriber>();

export const getAuthState = (): AuthState => state;

export const setAuthStateGlobal = (s: AuthState) => {
  state = { ...state, ...s };
  for (const sub of subscribers) sub(state);
};

export const subscribeAuth = (fn: Subscriber) => {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
};

export default {
  getAuthState,
  setAuthStateGlobal,
  subscribeAuth,
};
