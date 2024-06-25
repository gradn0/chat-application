import { FormEvent, useState } from "react"
import { useAuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import useMutate from "../hooks/useMutate";
import { getErrorMessage } from "../common";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const {dispatch} = useAuthContext();
  const navigate = useNavigate();

  const {mutateAsync: loginMutation, isPending} = useMutate("POST", "user/login", {username, password});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginMutation();
      if (data.Error) {
        throw new Error(data.Error);
      }
      dispatch({type: "login", payload: data});
      navigate("/");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }
  
  return (
    <div className="size-screen flex items-center justify-center h-[100vh]">
      
      <form className="flex flex-col gap-3 sm:gap-4 items-center" onSubmit={handleSubmit}>
        <h2 className="text-heading font-bold mb-8">Login</h2>

        <input className="authField" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input className="authField" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        <p className="text-red-700 text-small min-h-[2em]">{error && error}</p>
        <button disabled={isPending} className="w-[80%] btn">{isPending ? "Loading..." : "Log in"}</button>
        <a href="/signup" className="text-small sm:mt-3">Create an account</a>
      </form>
    </div>
  )
}

export default SignupPage