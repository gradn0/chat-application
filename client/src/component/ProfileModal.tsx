import { FormEvent, useState } from "react"
import { useAuthContext } from "../context/authContext"
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../helpers";
import { RefreshIcon } from "./Icons";
import {v4 as uuidv4} from "uuid";

const ProfileModal = ({closeModal}: {closeModal: () => void}) => {
  const {state, dispatch} = useAuthContext();
  const [username, setUsername] = useState(state.user?.username || "");
  const [imageURL, setImageURL] = useState(state.user?.icon_url);
  
  const {mutateAsync: editProfileMutation} = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      state.user && formData.append("oldUsername", state.user.username);
      if (username !== state.user?.username) formData.append("newUsername", username);
      imageURL && formData.append("iconUrl", imageURL);

      const res = await fetch(`${BASE_URL}/api/user/edit/${state.user?.id}`, {
        method: "POST",
        body: formData, 
      });
      const data = await res.json();
      dispatch({type: "edit", payload: {username: data.username, icon_url: data.icon_url}});
    }
  })

  const refreshImage = () => {
    const imageId = uuidv4();
    setImageURL(`https://i.pravatar.cc/150?u=${imageId}`);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    editProfileMutation();
    closeModal(); 
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-off_white p-10 border-[1px] border-grey rounded-lg shadow w-[90%] xs:w-[18em] z-10">
      <h2 className="text-subheading font-semibold mb-5">Edit Profile</h2>
      <p className="absolute top-0 right-0 pr-2 text-heading text-gray-400 cursor-pointer" onClick={closeModal}>×</p>
      <form className="flex flex-col gap-8" onSubmit={(e) => handleSubmit(e)}>

        <label className="text-small space-y-2">
          <p className="text-small text-neutral-500">Username</p>
          <input id="username" className="p-2 text-small focus:outline-none mb-4" value={username} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
        </label>

        <div className="flex items-center justify-center gap-[2em]">
          <img className="w-[5em]" src={imageURL} />
          <span className="cursor-pointer" onClick={refreshImage}><RefreshIcon color="grey"/></span>
        </div>
        <button className="btn">Update</button>
      </form>
      
    </div>
  )
}

export default ProfileModal