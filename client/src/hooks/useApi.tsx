import { useMutation } from "@tanstack/react-query"
import { useAuthContext } from "../context/authContext";

type Method = "GET" | "POST";

const useApi = (method: Method) => {
  const {state} = useAuthContext();
  return useMutation({
    onError: (error) => {throw error},
    mutationFn: async (query: string, body?:any) => {
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

export default useApi