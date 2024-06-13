import { useParams } from "react-router-dom"
import { IChat, IMessage } from "../common";
import { useChatContext } from "../context/chatContext";
import { FormEvent, useEffect, useRef, useState } from "react";
import MessagesList from "../component/MessagesList";
import { useQuery } from "@tanstack/react-query";
import { fetchFromAPI } from "../helpers";
import { queryClient } from "../main";
import socket from "../socket";
import { useAuthContext } from "../context/authContext";
import ChatPageHeader from "../component/ChatPageHeader";

const ChatPage = () => {
  const params = useParams();

  const {state} = useAuthContext();
  const {chats} = useChatContext();

  const [chat, setChat] = useState<IChat | null>(null);
  const [earliestId, setEarliestId] = useState<number | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatId, setChatId] = useState(useParams().chatId);

  const textFieldRef = useRef<HTMLInputElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!params.chatId) return;
    setChatId(chatId)
    const selectedId = parseInt(params.chatId);

    chats.forEach(chat => {
      if (chat.id === selectedId) {
        setChat(chat);
        return;
      }
    })
  }, [chats])

  useEffect(() => {
    socket.on("new-message", (message: IMessage) => {
      if (!chatId) return;
      if (parseInt(chatId) === message.room_id) {
        setMessages(current => [...current, message]);
        socket.emit("chat-seen", {userId: state.user?.id, chatId: chatId});
      }
    });
    
    return () => {
      setMessages([]);
      setEarliestId(null);
    }
  }, [])

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [messages]) 

  useQuery({
    queryKey: ["getMessages", chatId],
    queryFn: async () => {
      if (!chatId) return;
      const data =  (await fetchFromAPI(`chat/${chatId}/messages/?length=7` + (earliestId ? `&earliest=${earliestId}` : ""), "GET")).reverse();
      setEarliestId(data[0].id);

      if (earliestId) {
        setMessages(current => [...data, ...current]);
      } else {
        setMessages(data);
      }
      
      return data;
    }
  })

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!textFieldRef.current || !state.user) return;
    socket.emit("new-message", {sender_id: state.user.id, roomId: chatId, body: textFieldRef.current.value});
    textFieldRef.current.value = "";
  }
  
  return (
    <div className="size-full bg-dark_white flex flex-col relative">
      {chat && <ChatPageHeader chat={chat}/>}
      
      <div className="flex flex-col flex-1 overflow-y-scroll">
        <p 
          className="mx-auto size-min text-nowrap cursor-pointer bg-grey p-2 m-2 text-small text-neutral-500" 
          onClick={() => queryClient.fetchQuery({queryKey: ["getMessages", chatId]})}>
          Load more
        </p>
        <MessagesList messages={messages}/>
        <div ref={lastMessageRef}></div>
      </div>

      <form className="mx-auto w-[95%]" onSubmit={(e) => sendMessage(e)}>
      <input 
        ref={textFieldRef} 
        type="text" 
        className="mt-auto bg-grey text-black bg-opacity-60 focus:outline-none p-3 placeholder:text-neutral-500 m-3 rounded w-[90%] mx-auto" 
        placeholder="Type your message here..." />
      </form>
    </div>
  )
}

export default ChatPage