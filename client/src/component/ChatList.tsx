import { useEffect } from "react";
import { IChat } from "../common";
import ChatCard from "./ChatCard"
import { queryClient } from "../main";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const ChatList = ({chats}: {chats: IChat[] | undefined}) => {
  const navigate = useNavigate();
  const {setSidebarOpen} = useAppContext();

  const openChat = (chat: IChat) => {
    navigate(`/${chat.id}`);
    setSidebarOpen(false);
  }

  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["getChats"]}); // TODO: make socket event
  }, [])

  return (
    <div className="flex flex-col">
      {chats && chats.map(chat => <span key={chat.id} onClick={() => openChat(chat)}><ChatCard chat={chat} selected={false}/></span>)}
    </div>
  )
}

export default ChatList