import { useEffect } from "react"
import socket from "../socket"

const useSocketInit = () => {
  useEffect(() => {
    socket.connect();
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