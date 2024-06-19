import { IChat } from "../common";
import ChatCard from "./ChatCard"
import { useAppContext } from "../context/appContext";
import socket from "../socket";
import { useAuthContext } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import { useNavigate } from "react-router-dom";

const ChatList = ({chats}: {chats: IChat[] | undefined}) => {
  const {currentChat, setCurrentChat} = useChatContext();
  const {setSidebarOpen} = useAppContext();
  const {state} = useAuthContext();
  const navigate = useNavigate();

  const toggleChat = (chat: IChat) => {
    if (chat.id === currentChat?.id) {
      navigate("/");
      setCurrentChat(null);
      return;
    }
    chat.unseen_messages = false;
    socket.emit("chat-seen", {userId: state.user?.id, chatId: chat.id});
    setSidebarOpen(false);
    setCurrentChat(chat);
    navigate(`/${chat.id}`);
  }
 
  return (
    <div className="flex flex-col">
      {chats && chats.map(chat => 
      <span key={chat.id} onClick={() => toggleChat(chat)}>
        <ChatCard chat={chat} selected={false}/>
      </span>)}
    </div>
  )
}

export default ChatList