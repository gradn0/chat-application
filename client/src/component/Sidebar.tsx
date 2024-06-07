import { useEffect, useState } from "react"
import ChatList from "./ChatList"
import { BellIcon, ChatIcon, ChevronLeftIcon, ContactsIcon } from "./Icons"
import ContactList from "./ContactList";
import FriendRequests from "./FriendRequests";
import { useQuery } from "@tanstack/react-query";
import { fetchFromAPI } from "../helpers";
import { useAuthContext } from "../context/authContext";
import { IChat } from "../common";
import socket from "../socket";
import { queryClient } from "../main";
import { useChatContext } from "../context/chatContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";

type TTab = "contacts" | "chats" | "requests";

const Sidebar = () => {
  const [tab, setTab] = useState<TTab>("chats");
  const {state} = useAuthContext();
  const {setChats} = useChatContext();
  const [newChat, setNewChat] = useState(false);
  const [newContact, setNewContact] = useState(false);
  const [newRequest, setNewRequest] = useState(false);
  const navigate = useNavigate();
  const {setSidebarOpen} = useAppContext();
  const params = useParams();
  
  const {data: requests} = useQuery({
    queryKey: ["getRequests"],
    queryFn: async () => {
      const data = await fetchFromAPI("relationship/requests", "GET");
      return data.filter((item: any) => item.reciever_id === state.user?.id)
    }
  })

  const {data: contacts} = useQuery({
    queryKey: ["getContacts"],
    queryFn: async () => await fetchFromAPI("relationship/friends", "GET")
  })

  const {data: chats} = useQuery({
    queryKey: ["getChats"],
    queryFn: async () => {
      const chats: IChat[] = await fetchFromAPI("chat", "GET");
      
      chats.forEach((chat: IChat) => {
        if (chat.unseen_messages) {
          if (params.chatId && parseInt(params.chatId) === chat.id) {
            chat.unseen_messages = false;
          } else {
            setNewChat(true);
          }
        }
      });
      
      setChats(chats);
      return chats
    }
  })

  useEffect(() => {
    if (!chats || tab !== "chats") return;
    for (let i = 0; i<chats.length; i++) {
      if (chats[i].unseen_messages) {
        return;
      }
    }
    setNewChat(false);
  })

  useEffect(() => {
    socket.on("request-accepted", () => {
      setNewContact(true);
      queryClient.fetchQuery({queryKey: ["getContacts"]});
    });
    socket.on("friend-request", () => {
      setNewRequest(true);
      queryClient.fetchQuery({queryKey: ["getRequests"]});
    });
    socket.on("delete-chat", () => {
      queryClient.fetchQuery({queryKey: ["getChats"]});
      navigate("/");
    });
    socket.on("new-chat", () => {
      queryClient.fetchQuery({queryKey: ["getChats"]});
      setNewChat(true);
    });
    socket.on("new-message", () => {
      queryClient.fetchQuery({queryKey: ["getChats"]});
    });
  })

  return (
    <div className="bg-dark_accent size-full p-[2em] flex flex-col gap-[1em] rounded-r-xl">
      <div className="flex items-center mb-[1em]">
        <h2 className="text-heading font-bold text-off_white">PhotoShare</h2>
        <span className="cursor-pointer ml-auto desktop:hidden" onClick={() => setSidebarOpen(false)}><ChevronLeftIcon color="white" /></span>
      </div>
      <div className="flex gap-[3em]">

        <span className="hover:bg-accent p-2 rounded-full cursor-pointer relative" onClick={() => setTab("chats")}>
          <ChatIcon color="white"/>
          {newChat && tab !== "chats" && <span className="absolute rounded-full size-2 bg-green-400 bottom-0 right-0"></span>}
        </span>

        <span className="hover:bg-accent p-2 rounded-full cursor-pointer relative" onClick={() => {setTab("contacts"); setNewContact(false)}}>
          <ContactsIcon color="white"/>
          {newContact && tab !== "contacts" && <span className="absolute rounded-full size-2 bg-green-400 bottom-0 right-0"></span>}
        </span>

        <span className="hover:bg-accent p-2 rounded-full cursor-pointer relative" onClick={() => {setTab("requests"); setNewRequest(false)}}>
          <BellIcon color="white"/>
          {newRequest && tab !== "requests" && <span className="absolute rounded-full size-2 bg-green-400 bottom-0 right-0"></span>}
        </span>

      </div>
      <input className="searchBar p-3" type="text" placeholder="Search..."/>
      {tab === "chats" && <ChatList chats={chats}/>}
      {tab === "contacts" && <ContactList contacts={contacts}/>}
      {tab === "requests" && <FriendRequests requests={requests}/>}
      <div className="mt-auto">
        
      </div>
    </div>
  )
}

export default Sidebar