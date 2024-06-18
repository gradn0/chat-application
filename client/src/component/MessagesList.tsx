import { IMessage } from "../common"
import { useAuthContext } from "../context/authContext";
import MessageCard from "./MessageCard"

const MessagesList = ({messages}: {messages: IMessage[]}) => {
  const {state} = useAuthContext();

  return (
    <div className="size-full flex flex-col">
      <div className="mt-auto space-y-4 px-[4em] py-[2em]">
        {messages && messages.map((message,  i) => state.user && 
          <MessageCard 
            key={message.id} 
            message={message} 
            userId={state.user.id} 
            includeIcon={messages[i+1]?.sender_id !== message.sender_id}
          />
        )}
      </div> 
    </div>
  )
}

export default MessagesList
