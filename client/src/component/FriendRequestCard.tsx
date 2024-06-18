import { useMutation } from "@tanstack/react-query";
import { IRelationship } from "../common"
import { CrossIcon, TickIcon } from "./Icons"
import { fetchFromAPI } from "../helpers";
import { queryClient } from "../main";

type TResponse = "approved" | "denied";

const FriendRequestCard = ({request}: {request: IRelationship}) => {
  const {mutateAsync: acceptMutation} = useMutation({
    mutationFn: () => fetchFromAPI(`relationship/${request.id}`, "PATCH", {status: "approved"})
  });
  const {mutateAsync: denyMutation} = useMutation({
    mutationFn: () => fetchFromAPI(`relationship/${request.id}`, "DELETE")
  });

  const respondToRequest = async (response: TResponse) => {
    try {
      if (response === "approved") await acceptMutation();
      if (response === "denied") await denyMutation();
      await queryClient.invalidateQueries({queryKey: ["getRequests"]})
    } catch (error) {
      console.log(error); 
    }
  }

  return (
    <div className={`flex items-center gap-4 p-2 rounded-md cursor-pointer`}>
    <img className="avatar" src={request.icon_url || "src/assets/default-profile.png"} alt="chat avatar" />
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