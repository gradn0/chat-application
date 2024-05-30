import { IRelationship } from "../common";
import FriendRequestCard from "./FriendRequestCard";
import { useEffect } from "react";
import { queryClient } from "../main";

const FriendRequests = ({requests}: {requests: IRelationship[]}) => {
  useEffect(() => {
    queryClient.fetchQuery({queryKey: ["getRequests"]});
  }, [])
  
  return (
    <div className="flex flex-col gap-[1em]">
      {requests && requests.map((request: IRelationship) => <FriendRequestCard key={request.id} request={request} />)}
    </div>
  )
}

export default FriendRequests