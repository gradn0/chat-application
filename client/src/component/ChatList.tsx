import { useEffect } from "react";
import { IChat } from "../common";
import ChatCard from "./ChatCard"
import { queryClient } from "../main";
import { useNavigate } from "react-router-dom";

const ChatList = ({chats}: {chats: IChat[] | undefined}) => {
  const navigate = useNavigate();
  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["getChats"]}); // TODO: make socket event
  }, [chats])

  return (
    <div className="flex flex-col">
      {chats && chats.map(chat => <span key={chat.id} onClick={() => navigate(`/${chat.id}`)}><ChatCard chat={chat} selected={false}/></span>)}
    </div>
  )
}

export default ChatList