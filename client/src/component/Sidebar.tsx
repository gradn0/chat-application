import { useState } from "react"
import ChatList from "./ChatList"
import { ChatIcon, ContactsIcon } from "./Icons"
import ContactList from "./ContactList";

type TTab = "contacts" | "chats";

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
      </div>
      <input className="searchBar p-3" type="text" placeholder="Search..."/>
      {tab === "chats" && <ChatList />}
      {tab === "contacts" && <ContactList />}
    </div>
  )
}

export default Sidebar