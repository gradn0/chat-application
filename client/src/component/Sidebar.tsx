import { useState } from "react"
import ChatList from "./ChatList"
import { BellIcon, ChatIcon, ContactsIcon } from "./Icons"
import ContactList from "./ContactList";
import FriendRequests from "./FriendRequests";

type TTab = "contacts" | "chats" | "requests";

const Sidebar = () => {
  const [tab, setTab] = useState<TTab>("chats");

  return (
    <div className="bg-dark_accent size-full p-[2em] flex flex-col gap-[1em] rounded-r-xl">
      <div className="flex items-center">
        <h2 className="text-heading font-bold text-off_white mb-[1em]">PhotoShare</h2>
      </div>
      <div className="flex gap-[3em]">
         <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={() => setTab("chats")}><ChatIcon color="white"/></span>
         <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={() => setTab("contacts")}><ContactsIcon color="white"/></span>
         <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={() => setTab("requests")}><BellIcon color="white"/></span>
      </div>
      <input className="searchBar p-3" type="text" placeholder="Search..."/>
      {tab === "chats" && <ChatList />}
      {tab === "contacts" && <ContactList />}
      {tab === "requests" && <FriendRequests />}
    </div>
  )
}

export default Sidebar