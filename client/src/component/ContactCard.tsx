import { IRelationship } from "../common"

const ContactCard = ({contact, selected}: {contact: IRelationship, selected:boolean}) => {

  return (
    <div className={`flex items-center gap-4 p-2 rounded-md ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="avatar border-none" src={contact.icon_url || "src/assets/default-profile.png"} alt="chat avatar" />
      <h3>{contact.username}</h3>
    </div>
  )
}

export default ContactCard