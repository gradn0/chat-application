import { useState } from "react";
import { IChat } from "../common"
import { AddContactIcon } from "./Icons"
import AddContactModal from "./AddContactModal";

const ChatPageHeader = ({chat}: {chat: IChat}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-dark_white text-neutral-700 h-[10%] shadow-md text-xl sm:text-2xl flex items-center px-[2em] font-normal">
      {chat && <div className="flex items-center gap-10">
        <h2 className="mb-1 text-2xl font-semibold">{chat.room_name}</h2>
        <span className="cursor-pointer" onClick={() => setModalOpen(true)}><AddContactIcon color="grey"/></span>
      </div>}
      {modalOpen && <AddContactModal chat={chat} closeModal={() => setModalOpen(false)}/>}
    </div>
  )
}

export default ChatPageHeader