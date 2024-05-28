import { IChat } from "../Types"

const ChatCard = ({chat, selected}: {chat: IChat, selected:boolean}) => {
  return (
    <div className={`flex items-center gap-4 p-2 rounded-md cursor-pointer ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="size-[3em] bg-white rounded-full" src={chat.icon_url} alt="chat avatar" />
      <div className="text-off_white">
        <h3 className="font-semibold">{chat.title}</h3>
        <p className="text-small">{chat.latest_message}</p>
      </div>
      <span className="bg-off_white size-[1.5em] rounded-full flex items-center justify-center text-small ml-auto">
        <p className="pb-[0.1em]">{chat.unread}</p>
      </span>
    </div>
  )
}

export default ChatCard