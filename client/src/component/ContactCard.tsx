import { useMutation } from "@tanstack/react-query";
import { IRelationship } from "../common"
import { useAuthContext } from "../context/authContext";
import { MessageIcon } from "./Icons"
import { fetchFromAPI } from "../helpers";

interface ICreateRoomBody {
  usernames: string[], 
  ids: number[]
}

const ContactCard = ({contact, selected}: {contact: IRelationship, selected:boolean}) => {
  const {state} = useAuthContext();

  const createRoom = () => {
    if (!state.user) return;
    const body: ICreateRoomBody = {
      usernames: [contact.username, state.user.username], 
      ids: [contact.request_id, contact.reciever_id]
    };
    createRoomMutation(body)
  }

  const {mutateAsync: createRoomMutation} = useMutation({
    mutationFn: (body: ICreateRoomBody) => fetchFromAPI("chat", "POST", body)
  });

  return (
    <div className={`flex items-center gap-4 p-2 rounded-md ${selected ? "bg-accent bg-opacity-60" : ""}`}>
      <img className="size-[3em] bg-white rounded-full" src="https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x" alt="chat avatar" />
      <h3 className="font-semibold text-off_white">{contact.username}</h3>
      <span className="cursor-pointer ml-auto" onClick={createRoom}><MessageIcon color="white"/></span>
    </div>
  )
}

export default ContactCard