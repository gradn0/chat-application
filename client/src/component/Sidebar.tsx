import { useState } from "react"
import ChatList from "./ChatList"
import { BellIcon, ChatIcon, ContactsIcon } from "./Icons"
import ContactList from "./ContactList";
import FriendRequests from "./FriendRequests";
import { useQuery } from "@tanstack/react-query";
import { fetchFromAPI } from "../helpers";
import { useAuthContext } from "../context/authContext";
import { IChat } from "../common";

type TTab = "contacts" | "chats" | "requests";

const Sidebar = () => {
  const [tab, setTab] = useState<TTab>("chats");
  const {state} = useAuthContext();
  
  const {data: requests} = useQuery({
    queryKey: ["getRequests"],
    queryFn: async () => {
      const data = await fetchFromAPI("relationship/requests", "GET");
      return data.filter((item: any) => item.reciever_id == state.user?.id)
    }
  })

  const {data: contacts} = useQuery({
    queryKey: ["getContacts"],
    queryFn: async () => await fetchFromAPI("relationship/friends", "GET")
  })

  const {data: chats} = useQuery({
    queryKey: ["getChats"],
    queryFn: async () => {
      const chats = await fetchFromAPI("chat", "GET");
      
      chats.forEach((chat: IChat) => {
        const name = chat.name;
        if (RegExp(/^dm-/).test(name)) {
          const users = name.split("-")[1].split("/");
          if (!state.user) return;
          chat.name = state.user.username === users[0] ? users[1] : users[0];
        }
      });
      
      return chats
    }
  })

  return (
    <div className="bg-dark_accent size-full p-[2em] flex flex-col gap-[1em] rounded-r-xl">
      <div className="flex items-center">
        <h2 className="text-heading font-bold text-off_white mb-[1em]">PhotoShare</h2>
      </div>
      <div className="flex gap-[3em]">
        <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={() => setTab("chats")}><ChatIcon color="white"/></span>
        <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={() => setTab("contacts")}><ContactsIcon color="white"/></span>
        <span className="hover:bg-accent p-2 rounded-full cursor-pointer relative" onClick={() => setTab("requests")}>
          <BellIcon color="white"/>
          {requests && requests.length > 0 && <span className="absolute rounded-full size-2 bg-green-400 bottom-0 right-0"></span>}
        </span>
      </div>
      <input className="searchBar p-3" type="text" placeholder="Search..."/>
      {tab === "chats" && <ChatList chats={chats}/>}
      {tab === "contacts" && <ContactList contacts={contacts}/>}
      {tab === "requests" && <FriendRequests requests={requests}/>}
    </div>
  )
}

export default Sidebar