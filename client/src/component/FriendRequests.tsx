import { IRelationship } from "../common";
import FriendRequestCard from "./FriendRequestCard";

const FriendRequests = ({requests}: {requests: IRelationship[]}) => {
  return (
    <div className="flex flex-col gap-[1em]">
      {requests && requests.map((request: IRelationship) => <FriendRequestCard key={request.id} request={request} />)}
    </div>
  )
}

export default FriendRequests