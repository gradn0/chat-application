import { PropsWithChildren, createContext, useContext, useEffect, useReducer } from "react"

interface User {
  id: number;
  username: string;
  token: string;
  icon_url: string;
}
interface State {
  user: User | null;
} 
interface Action {
  type: "login" | "logout" | "edit";
  payload: User;
} 
interface AuthContext {
  state: State;
  dispatch: any;
}
type Props = PropsWithChildren;

export const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'login':
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {user: action.payload};
    case 'logout':
      localStorage.removeItem("user");
      return {user: null};
    case 'edit':
      const current = localStorage.getItem("user");
      if (current) {
        const currentJson = JSON.parse(current);
        localStorage.setItem("user", JSON.stringify({...currentJson, ...action.payload}));
      }
      return {user: {...state.user, ...action.payload}};
    default:
      return state;
  }
}

export const authContext = createContext<AuthContext | null>(null);
const initState = {user: null};

export const AuthContextProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(authReducer, initState);
  useEffect(() => {
    const item = localStorage.getItem("user");
    if (item) {
      const user: User = JSON.parse(item);
      dispatch({type: "login", payload: user});
    }
  }, [])
  
  return (
    <authContext.Provider value={{state, dispatch}}>
      {children}
    </authContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("authContest must be used within a provider");
  }
  return context;
}
