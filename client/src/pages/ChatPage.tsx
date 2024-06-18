import { IMessage } from "../common";
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
  const {state} = useAuthContext();
  const {currentChat} = useChatContext();

  const [earliestId, setEarliestId] = useState<number | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const textFieldRef = useRef<HTMLInputElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("new-message", (message: IMessage) => {
      if (!currentChat) return;
      if (currentChat.id === message.room_id) {
        setMessages(current => [...current, message]);
        socket.emit("chat-seen", {userId: state.user?.id, chatId: currentChat.id});
      }
    });

    return () => {
      socket.off("new-message");
    }
  }, [currentChat])

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [messages]) 

  useQuery({
    queryKey: ["getMessages", currentChat?.id],
    queryFn: async () => {
      if (!currentChat) return;
      const data =  (await fetchFromAPI(`chat/${currentChat.id}/messages/?length=7` + (earliestId ? `&earliest=${earliestId}` : ""), "GET")).reverse();
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
    if (!textFieldRef.current || !state.user || !currentChat) return;
    socket.emit("new-message", {sender_id: state.user.id, roomId: currentChat.id, body: textFieldRef.current.value});
    textFieldRef.current.value = "";
  }
  
  return (
    <div className="size-full bg-dark_white flex flex-col relative">
      {currentChat && <ChatPageHeader chat={currentChat}/>}
      
      <div className="flex flex-col flex-1 overflow-y-scroll">
        <p 
          className="mx-auto size-min text-nowrap cursor-pointer bg-grey p-2 m-2 text-small text-neutral-500" 
          onClick={() => queryClient.fetchQuery({queryKey: ["getMessages", currentChat?.id]})}>
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