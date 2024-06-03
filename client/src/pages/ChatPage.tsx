import { useParams } from "react-router-dom"
import { IChat } from "../common";
import { useChatContext } from "../context/chatContext";
import { useEffect, useState } from "react";
import MessagesList from "../component/MessagesList";

const messages = [ // temp
  {
    id: 1,
    body: "Hello",
    sender_id: 30,
    created_at: "2024-06-03 15:18:30.282378+01",
    room_id: 11,
  },
  {
    id: 2,
    body: "hi there",
    sender_id: 21,
    created_at: "2024-06-03 15:19:05.388569+01",
    room_id: 11,
  }, 
]

const ChatPage = () => {
  const {chatId} = useParams();
  const {chats} = useChatContext();
  const [chat, setChat] = useState<IChat | null>(null);

  useEffect(() => {
    if (!chatId) return;
    const selectedId = parseInt(chatId);
    chats.forEach(chat => {
      if (chat.id === selectedId) {
        setChat(chat);
        return;
      }
    })
  }, [chatId])

  return (
    <div className="size-full bg-dark_white flex flex-col">
      <div className="bg-dark_white text-neutral-700 h-[10%] shadow-md text-xl sm:text-2xl flex items-center px-[2em] font-normal">
        {chat && chat.name}
      </div>
      <div className="flex-1 overflow-y-scroll">
        <MessagesList messages={messages}/>
      </div>
      <input type="text" className="mt-auto bg-grey text-black bg-opacity-60 focus:outline-none p-3 placeholder:text-neutral-500 m-3 rounded" placeholder="Type your message here..." />
    </div>
  )
}

export default ChatPage