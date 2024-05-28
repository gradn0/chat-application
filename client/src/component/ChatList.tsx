import { Chat } from "../Types"
import ChatCard from "./ChatCard"

const ChatList = ({chats}: {chats: Chat[]}) => {
  return (
    <div className="flex flex-col gap-[3em]">
      {chats.map(chat => <ChatCard chat={chat} selected={false}/>)}
    </div>
  )
}

export default ChatList