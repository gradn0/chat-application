import ChatCard from "./ChatCard"

const chats = [ // temp
  {
    id: 2,
    title: "Richard Hendrics",
    icon_url: "https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x",
    unread: 2,
    latest_message: "hello there"
  }
]

const ChatList = () => {
  return (
    <div className="flex flex-col gap-[3em]">
      {chats.map(chat => <ChatCard key={chat.id} chat={chat} selected={false}/>)}
    </div>
  )
}

export default ChatList