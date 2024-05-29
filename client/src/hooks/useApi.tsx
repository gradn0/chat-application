import { useMutation } from "@tanstack/react-query"

type Method = "GET" | "POST";

const useApi = (method: Method, query: string, body?:any) => {
  return useMutation({
    onError: (error) => {throw error},
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/api/${query}`, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        }
      });
      return res.json();
    },
  })
}

export default useApi