import { useState } from "react"
import ContactCard from "./ContactCard"
import { AddContactIcon } from "./Icons"
import useApi from "../hooks/useApi"

const contacts = [ // temp
  {
    id: 2,
    name: "Richard Hendrics",
    icon_url: "https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x",
  }
]

const ContactList = () => {
  const [text, setText] = useState("");
  const {mutateAsync: friendRequestMutation} = useApi("POST");

  const sendFriendRequest = async () => {
    setText("");
    await friendRequestMutation(`user/friendRequest/${text}`);
  }

  return (
    <div className="flex flex-col h-full">
      {contacts.map(contact => <ContactCard key={contact.id} contact={contact} selected={false}/>)}
      <div className="flex mt-auto gap-2">
        <input className="searchBar px-2 text-small" value={text} type="text" placeholder="Send friend request..." onChange={(e) => setText(e.target.value)}/>
        <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={sendFriendRequest}><AddContactIcon color="white"/></span>
      </div>
    </div>
  )
}

export default ContactList