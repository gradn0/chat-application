import { IMessage } from "../common"

const MessageCard = ({message, userId}: {message: IMessage, userId: number}) => {
  if (userId == message.sender_id) {
    return (
      <div className="flex">
        <p className="bg-accent inline-block p-4 ml-auto rounded-t-lg rounded-bl-lg">{message.body}</p>
      </div>
    )
  } else {
    return (
      <div className="flex">
        <p className="bg-grey inline-block p-4 mr-auto rounded-t-lg rounded-br-lg">{message.body}</p>
      </div>
    )
  }
}

export default MessageCard