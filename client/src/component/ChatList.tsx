import { IChat } from "../common";
import ChatCard from "./ChatCard"
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import socket from "../socket";
import { useAuthContext } from "../context/authContext";

const ChatList = ({chats}: {chats: IChat[] | undefined}) => {
  const navigate = useNavigate();
  const {setSidebarOpen} = useAppContext();
  const {state} = useAuthContext();

  const openChat = (chat: IChat) => {
    navigate(`/${chat.id}`);
    chat.unseen_messages = false;
    socket.emit("chat-seen", {userId: state.user?.id, chatId: chat.id});
    setSidebarOpen(false);
  }
 
  return (
    <div className="flex flex-col">
      {chats && chats.map(chat => 
      <span key={chat.id} onClick={() => openChat(chat)}>
        <ChatCard chat={chat} selected={false}/>
      </span>)}
    </div>
  )
}

export default ChatList