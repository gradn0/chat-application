export const BASE_URL = import.meta.env.VITE_SERVER_HOST;

export const fetchFromAPI = async (query: string, requestType: string, body?:any, headers?:{}) => {
  const item = localStorage.getItem("user");
  let user;
  if (item) {
    user = JSON.parse(item);
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${user.token}`
  }
  
  const res = await fetch(`${BASE_URL}/api/${query}`, {
    method: requestType,
    body: JSON.stringify(body), 
    headers: headers ? {...headers, "Authorization": `Bearer ${user.token}`} : defaultHeaders
  });
  const json = await res.json();
  return json;
}