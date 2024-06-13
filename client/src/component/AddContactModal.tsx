import { useMutation } from "@tanstack/react-query";
import { IChat, IRelationship } from "../common";
import { useChatContext } from "../context/chatContext";
import ContactCard from "./ContactCard";
import { fetchFromAPI } from "../helpers";
import { useAuthContext } from "../context/authContext";
import { useState } from "react";

const AddContactModal = ({closeModal, chat}: {closeModal: () => void, chat: IChat}) => {
  const {contacts} = useChatContext();
  const {state} = useAuthContext();
  const [roomName, setRoomName] = useState(chat.room_name);

  const {mutateAsync: addGroupMemberMutation} = useMutation({
    mutationFn: async (contact: IRelationship) => {
      if (!state.user) return;
      const id = contact.request_id === state.user.id ? contact.reciever_id : contact.request_id;
      await fetchFromAPI(`chat/${id}`, "PUT", {roomId: chat.id, roomName})
    }
  });

  const addContactToGroup = (contact: IRelationship) => {
    addGroupMemberMutation(contact);
    closeModal();
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-off_white p-10 border-[1px] border-grey rounded-lg shadow w-[90%] xs:w-[18em]">
      <h2 className="text-subheading font-semibold mb-5">Add Member</h2>
      <p className="absolute top-0 right-0 pr-2 text-heading text-gray-400 cursor-pointer" onClick={closeModal}>×</p>
      <input className="p-2 text-small focus:outline-none mb-4" value={roomName} type="text" placeholder="Room name..." onChange={(e) => setRoomName(e.target.value)}/>
      <ul className="space-y-2">
        {contacts.map(contact => 
          <div className="cursor-pointer text-neutral-700 hover:bg-white" key={contact.id} onClick={() => addContactToGroup(contact)}>
            <ContactCard key={contact.id} contact={contact} selected={false}/>
          </div>
        )}
      </ul>
      
    </div>
  )
}

export default AddContactModal