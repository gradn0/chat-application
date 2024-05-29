import { IContact } from "../common"

const ContactCard = ({contact, selected}: {contact: IContact, selected:boolean}) => {
  return (
    <div className={`flex items-center gap-4 p-2 rounded-md cursor-pointer ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="size-[3em] bg-white rounded-full" src={contact.icon_url} alt="chat avatar" />
      <div className="text-off_white">
        <h3 className="font-semibold">{contact.name}</h3>
      </div>
    </div>
  )
}

export default ContactCard