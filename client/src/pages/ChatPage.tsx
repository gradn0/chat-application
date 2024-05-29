const chat = { // temp
  title: "Richard Hendrics",
  icon_url: "https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x",
  unread: 2,
  latest_message: "hello there"
}

const ChatPage = () => {
  
  return (
    <div className="size-full bg-dark_white flex flex-col">
      <div className="bg-dark_white text-neutral-700 h-[10%] shadow-md text-xl sm:text-2xl flex items-center px-[2em] font-normal">
        {chat.title}
      </div>
      <div className="flex-1">

      </div>
      <input type="text" className="mt-auto bg-grey text-black bg-opacity-60 focus:outline-none p-3 placeholder:text-neutral-500 m-3 rounded" placeholder="Type your message here..." />
    </div>
  )
}

export default ChatPage