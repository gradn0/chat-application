import { useState } from "react"
import ContactCard from "./ContactCard"
import { AddContactIcon } from "./Icons"
import { useMutation } from "@tanstack/react-query"
import { fetchFromAPI } from "../helpers"
import { IRelationship } from "../common"

const ContactList = ({contacts}: {contacts: IRelationship[]}) => {
  const [text, setText] = useState("");

  const {mutateAsync: postFriendRequest} = useMutation({
    mutationFn: (query: string) => fetchFromAPI(query, "POST")
  })

  const sendFriendRequest = async () => {
    setText("");
    await postFriendRequest(`relationship/${text}`);
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