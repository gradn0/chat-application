import ChatList from "./ChatList"
import { ChatIcon, ContactsIcon } from "./Icons"

const chats = [
  {
    title: "Richard Hendrics",
    icon_url: "https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x",
    unread: 2,
    latest_message: "hello there"
  }
]

const Sidebar = () => {
  return (
    <div className="bg-dark_accent size-full p-[2em] flex flex-col gap-[1em]">
      <div className="flex items-center">
        <h2 className="text-heading text-off_white font-medium mb-[1em]">PhotoShare</h2>
      </div>
      <input className="searchBar" type="text" placeholder="Search..."/>
      <div className="flex gap-[3em]">
         <span className="hover:bg-accent p-2 rounded-full cursor-pointer"><ChatIcon color="white"/></span>
         <span className="hover:bg-accent p-2 rounded-full cursor-pointer"><ContactsIcon color="white"/></span>
      </div>
      <ChatList chats={chats}/>
    </div>
  )
}

export default Sidebar