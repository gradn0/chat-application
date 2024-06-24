import { useState } from "react";
import { IChat } from "../common"
import { AddContactIcon, ExitIcon } from "./Icons"
import AddContactModal from "./AddContactModal";
import { useMutation } from "@tanstack/react-query";
import { fetchFromAPI } from "../helpers";
import { useAuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const ChatPageHeader = ({chat}: {chat: IChat}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const {state} = useAuthContext();
  const navigate = useNavigate();

  const {mutateAsync: exitChatMutation} = useMutation({
    mutationFn: async () => await fetchFromAPI(`chat/leave/?userId=${state.user?.id}&roomId=${chat.id}`, "POST")
  })

  const leaveChat= () => {
    exitChatMutation();
    navigate("/");
  }
  
  return (
    <div className="bg-dark_white text-neutral-700 h-[10%] shadow-md text-xl sm:text-2xl flex items-center px-[2em] font-normal">
      {chat && <div className="flex items-center gap-10">
        <h2 className="mb-1 text-2xl font-semibold">{chat.room_name}</h2>
        {chat.is_admin && <span className="cursor-pointer" onClick={() => setModalOpen(true)}><AddContactIcon color="grey"/></span>}
        {!chat.is_admin && <span className="cursor-pointer" onClick={leaveChat}><ExitIcon color="grey"/></span>}
      </div>}
      {modalOpen && <AddContactModal chat={chat} closeModal={() => setModalOpen(false)}/>}
    </div>
  )
}

export default ChatPageHeader