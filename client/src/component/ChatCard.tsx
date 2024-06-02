import { IChat } from "../common"

const ChatCard = ({chat, selected}: {chat: IChat, selected:boolean}) => {
  return (
    <div className={`flex items-center gap-4 p-2 rounded-md cursor-pointer ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="size-[3em] bg-white rounded-full" src="https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x" alt="chat avatar" />
      <div className="text-off_white">
        <h3 className="font-semibold">{chat.name}</h3>
      </div>
    </div>
  )
}

export default ChatCard