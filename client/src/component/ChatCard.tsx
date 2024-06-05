import { useMutation } from "@tanstack/react-query"
import { IChat } from "../common"
import { queryClient } from "../main"
import { CrossIcon } from "./Icons"
import { fetchFromAPI } from "../helpers"
import socket from "../socket"

const ChatCard = ({chat, selected}: {chat: IChat, selected:boolean}) => {
  const {mutateAsync: deleteChatMutation} = useMutation({
    mutationFn: async () => {
      const res = fetchFromAPI(`chat/${chat.id}`, "DELETE");
      socket.emit("delete-chat", {roomId: chat.id})
      queryClient.invalidateQueries({queryKey: ["getChats"]});
      return res;
    }
  })

  return (
    <div className={`flex items-center gap-4 p-2 rounded-md cursor-pointer ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="size-[3em] bg-white rounded-full" src="https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x" alt="chat avatar" />
      <div className="text-off_white">
        <h3 className="font-semibold">{chat.name}</h3>
      </div>
      <span 
        className="hover:bg-accent p-2 rounded-full cursor-pointer relative ml-auto"
        onClick={() => deleteChatMutation()}
      >
        <CrossIcon color="white" />
      </span>
    </div>
  )
}

export default ChatCard