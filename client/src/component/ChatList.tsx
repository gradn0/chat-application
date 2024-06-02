import { useEffect } from "react";
import { IChat } from "../common";
import ChatCard from "./ChatCard"
import { queryClient } from "../main";

const ChatList = ({chats}: {chats: IChat[]}) => {
  useEffect(() => {
    queryClient.fetchQuery({queryKey: ["getChats"]});
  }, [])
  return (
    <div className="flex flex-col">
      {chats && chats.map(chat => <ChatCard key={chat.id} chat={chat} selected={false}/>)}
    </div>
  )
}

export default ChatList