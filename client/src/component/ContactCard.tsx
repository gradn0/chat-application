import { IRelationship } from "../common"

const ContactCard = ({contact, selected}: {contact: IRelationship, selected:boolean}) => {

  return (
    <div className={`flex items-center gap-4 p-2 rounded-md ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="avatar" src="https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x" alt="chat avatar" />
      <h3>{contact.username}</h3>
    </div>
  )
}

export default ContactCard