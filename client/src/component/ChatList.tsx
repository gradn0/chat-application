import { IChat } from "../common";
import ChatCard from "./ChatCard"
import { useAppContext } from "../context/appContext";
import socket from "../socket";
import { useAuthContext } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import { useNavigate } from "react-router-dom";

const ChatList = ({chats}: {chats: IChat[] | undefined}) => {
  const {setCurrentChat} = useChatContext();
  const {setSidebarOpen} = useAppContext();
  const {state} = useAuthContext();
  const navigate = useNavigate();

  const openChat = (chat: IChat) => {
    chat.unseen_messages = false;
    socket.emit("chat-seen", {userId: state.user?.id, chatId: chat.id});
    setSidebarOpen(false);
    setCurrentChat(chat);
    navigate("/chat");
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