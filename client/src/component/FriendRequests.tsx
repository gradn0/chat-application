import { IFriendRequest } from "../common";
import FriendRequestCard from "./FriendRequestCard";
import { useEffect } from "react";
import { queryClient } from "../main";

const FriendRequests = ({requests}: {requests: IFriendRequest[]}) => {
  useEffect(() => {
    queryClient.fetchQuery({queryKey: ["getFriendRequests"]});
  }, [])
  
  return (
    <div className="flex flex-col gap-[1em]">
      {requests && requests.map((request: IFriendRequest) => <FriendRequestCard key={request.id} request={request} />)}
    </div>
  )
}

export default FriendRequests