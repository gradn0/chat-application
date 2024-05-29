import { useMutation } from "@tanstack/react-query"
import { useAuthContext } from "../context/authContext";

type Method = "DELETE" | "POST" | "PATCH";

const useMutate = (method: Method, query: string, body?:any) => {
  const {state} = useAuthContext();
  return useMutation({
    onError: (error) => {throw error},
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/api/${query}`, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.user?.token}`
        }
      });
      return res.json();
    },
  })
}

export default useMutate