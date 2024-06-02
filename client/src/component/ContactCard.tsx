import { IRelationship } from "../common"
import socket from "../socket";
import { MessageIcon } from "./Icons"

const ContactCard = ({contact, selected}: {contact: IRelationship, selected:boolean}) => {
  const createRoom = () => {
    socket.emit("create-room", {name: `dm-${contact.request_id}/${contact.reciever_id}`, ids: [contact.reciever_id, contact.request_id]});
  }
  return (
    <div className={`flex items-center gap-4 p-2 rounded-md ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="size-[3em] bg-white rounded-full" src="https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x" alt="chat avatar" />
      <h3 className="font-semibold text-off_white">{contact.username}</h3>
      <span className="cursor-pointer ml-auto" onClick={createRoom}><MessageIcon color="white"/></span>
    </div>
  )
}

export default ContactCard