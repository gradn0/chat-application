export const BASE_URL = import.meta.env.VITE_SERVER_HOST;

export const fetchFromAPI = async (query: string, requestType: string, body?:any) => {
  const item = localStorage.getItem("user");
  let user;
  if (item) {
    user = JSON.parse(item);
  }
  
  const res = await fetch(`${BASE_URL}/api/${query}`, {
    method: requestType,
    body: JSON.stringify(body), 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user.token}`
    }
  });
  const json = await res.json();
  return json;
}