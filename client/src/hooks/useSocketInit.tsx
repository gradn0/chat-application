import { useEffect } from "react"
import socket from "../socket"

const useSocketInit = () => {
  const item = localStorage.getItem("user");
  
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      if (item) {
        const user = JSON.parse(item);
        socket.emit("ehlo", {id: user.id});
      }
    })
    socket.on("connect_error", () => {
      console.log("connection failed"); // TODO: redirect to error boundary
    })
    return () => {
      socket.off("connect_error");
    }
  }, []);
  return 
}

export default useSocketInit