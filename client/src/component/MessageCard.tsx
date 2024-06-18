import { IMessage } from "../common"
import { useChatContext } from "../context/chatContext";

const MessageCard = ({message, userId, includeIcon}: {message: IMessage, userId: number, includeIcon:boolean}) => {
  const timestamp = message.created_at.split(/[- :T]/);
  const {currentChat} = useChatContext();

  if (userId == message.sender_id) {
    return (
      <div className="flex items-end gap-4">
        <div className={`flex flex-col bg-accent p-4 ml-auto rounded-t-lg rounded-bl-lg max-w-[35ch] ${includeIcon && "mb-[3em]"}`}>
          <p className="text-small text-neutral-600">{`${timestamp[2]}/${timestamp[1]} • ${timestamp[3]}:${timestamp[4]}`}</p>
          {message.body}
        </div>

        {currentChat && currentChat.member_count > 2 && 
        <div className="flex flex-col items-center min-w-[4em]">
          {includeIcon && 
          <>
            <img className="avatar scale-75" src={message.icon_url || "src/assets/default-profile.png"} alt="" />
            <p className="text-small">{message.username}</p>
          </>}
        </div>}
      </div>
    )
  } else {
    return (
      <div className="flex items-end gap-4">
        {currentChat && currentChat.member_count > 2 &&  
        <div className="flex flex-col items-center min-w-[4em]">
        {includeIcon && 
          <>
            <img className="avatar scale-75" src={message.icon_url || "src/assets/default-profile.png"} alt="" />
            <p className="text-small">{message.username}</p>
          </>
          }
        </div>}

        <div className={`flex flex-col bg-grey p-4 mr-auto rounded-t-lg rounded-br-lg max-w-[35ch] ${includeIcon && "mb-[3em]"}`}>
          <p className="text-small text-neutral-500">{`${timestamp[2]}/${timestamp[1]} • ${timestamp[3]}:${timestamp[4]}`}</p>
          {message.body}
        </div>
        
      </div>
    )
  }
}

export default MessageCard