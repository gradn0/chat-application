import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from "react"
import { IChat } from "../common";

interface ChatContext {
  chats: IChat[];
  setChats: Dispatch<SetStateAction<IChat[]>>
}
type Props = PropsWithChildren;

export const chatContext = createContext<ChatContext | null>(null);

export const ChatContextProvider = ({children}: Props) => {
  const [chats, setChats] = useState<IChat[]>([]);
  console.log(chats);
  
  return (
    <chatContext.Provider value={{chats, setChats}}>
      {children}
    </chatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(chatContext);
  if (!context) {
    throw new Error("chatContest must be used within a provider");
  }
  return context;
}
