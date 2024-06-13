import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from "react"
import { IChat, IRelationship } from "../common";

interface ChatContext {
  chats: IChat[];
  setChats: Dispatch<SetStateAction<IChat[]>>;
  contacts: IRelationship[];
  setContacts: Dispatch<SetStateAction<IRelationship[]>>;
}
type Props = PropsWithChildren;

export const chatContext = createContext<ChatContext | null>(null);

export const ChatContextProvider = ({children}: Props) => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [contacts, setContacts] = useState<IRelationship[]>([]);

  return (
    <chatContext.Provider value={{chats, setChats, contacts, setContacts}}>
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
