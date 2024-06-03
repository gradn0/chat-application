import Sidebar from "./component/Sidebar"
import useSocketInit from "./hooks/useSocketInit"
import { Outlet } from "react-router-dom";

function App() {
  useSocketInit();
  return (
    <div className="h-screen flex">
      <div className="w-[30%]"><Sidebar /></div>
      <div className="flex-1"><Outlet /></div>
    </div>
  )
}

export default App
