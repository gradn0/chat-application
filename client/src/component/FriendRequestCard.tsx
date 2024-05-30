import { useMutation } from "@tanstack/react-query";
import { IFriendRequest } from "../common"
import { CrossIcon, TickIcon } from "./Icons"
import { fetchFromAPI } from "../helpers";
import { queryClient } from "../main";

type TResponse = "approved" | "denied";

const FriendRequestCard = ({request}: {request: IFriendRequest}) => {
  const {mutateAsync: responseMutation} = useMutation({
    mutationFn: (status: TResponse) => fetchFromAPI(`user/friendRequest/${request.id}`, "PATCH", {status})
  });

  const respondToRequest = async (response: TResponse) => {
    try {
      await responseMutation(response);
      await queryClient.invalidateQueries({queryKey: ["getFriendRequests"]})
    } catch (error) {
      console.log(error); 
    }
  }

  return (
    <div className={`flex items-center gap-4 p-2 rounded-md cursor-pointer`}>
    <img className="size-[3em] bg-white rounded-full" src="https://gravatar.com/avatar/d410f9be84581256aa7a1d57640443fb?s=400&d=robohash&r=x" alt="chat avatar" />
    <div className="text-off_white">
      <h3 className="font-semibold">{request.username}</h3>
    </div>
    <div className="ml-auto flex gap-6">
      <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={() => respondToRequest("approved")}><TickIcon color="white"/></span>
      <span className="hover:bg-accent p-2 rounded-full cursor-pointer" onClick={() => respondToRequest("denied")}><CrossIcon color="white"/></span>
    </div>
  </div>
  )
}

export default FriendRequestCard