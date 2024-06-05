import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from "react"

interface AppContext {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}
type Props = PropsWithChildren;

export const appContext = createContext<AppContext | null>(null);

export const AppContextProvider = ({children}: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <appContext.Provider value={{sidebarOpen, setSidebarOpen}}>
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(appContext);
  if (!context) {
    throw new Error("appContest must be used within a provider");
  }
  return context;
}
