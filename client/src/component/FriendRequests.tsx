import { useQuery } from "@tanstack/react-query"
import { fetchFromAPI } from "../helpers"
import { IFriendRequest } from "../Types";
import FriendRequestCard from "./FriendRequestCard";

const FriendRequests = () => {
  const {data: requests} = useQuery({
    queryKey: ["getFriendRequests"],
    queryFn: () => fetchFromAPI("user/friendRequests", "GET")
  })
  
  return (
    <div className="flex flex-col gap-[1em]">
      {requests && requests.map((request: IFriendRequest) => <FriendRequestCard key={request.id} request={request} />)}
    </div>
  )
}

export default FriendRequests