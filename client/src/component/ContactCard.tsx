import { IRelationship } from "../common"
import { MessageIcon } from "./Icons"

const ContactCard = ({contact, selected}: {contact: IRelationship, selected:boolean}) => {
  const createRoom = () => {

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