import { useState } from "react"
import ContactCard from "./ContactCard"
import { AddContactIcon } from "./Icons"
import { useMutation } from "@tanstack/react-query"
import { fetchFromAPI } from "../helpers"
import { IRelationship } from "../common"
import { MessageIcon } from "./Icons"
import { useAuthContext } from "../context/authContext"

interface IUserPayload {
  id: number;
  username: string;
}

interface ICreateRoomBody {
  creator: IUserPayload;
  recipient: IUserPayload;
}

const ContactList = ({contacts}: {contacts: IRelationship[]}) => {
  const [text, setText] = useState("");
  const {state} = useAuthContext();


  const {mutateAsync: friendRequestMutation} = useMutation({
    mutationFn: (query: string) => fetchFromAPI(query, "POST")
  })
  const {mutateAsync: createRoomMutation} = useMutation({
    mutationFn: (body: ICreateRoomBody) => fetchFromAPI("chat", "POST", body)
  });

  const sendFriendRequest = async () => {
    setText("");
    await friendRequestMutation(`relationship/${text}`);
  }

  const createRoom = (contact: IRelationship) => {
    if (!state.user) return;
    const recipientId = contact.request_id === state.user.id ? contact.reciever_id : contact.request_id;
    const body = {
      creator: {
        id: state.user.id, 
        username: state.user.username
      },
      recipient: {
        id: recipientId, 
        username: contact.username
      }
    }
    createRoomMutation(body);
  }

  return (
    <div className="flex flex-col h-full">
      {contacts.map(contact => 
        <span className="flex items-center text-off_white font-semibold">
          <ContactCard key={contact.id} contact={contact} selected={false}/>
          <span className="cursor-pointer ml-auto" onClick={() => createRoom(contact)}><MessageIcon color="white"/></span>
        </span>
      )}
      <div className="flex mt-auto gap-2">
        <input className="searchBar px-2 text-small" value={text} type="text" placeholder="Send friend request..." onChange={(e) => setText(e.target.value)}/>
        <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={sendFriendRequest}><AddContactIcon color="white"/></span>
      </div>
    </div>
  )
}

export default ContactList