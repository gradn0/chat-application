import { MenuIcon } from "./component/Icons";
import Sidebar from "./component/Sidebar"
import useMediaQuery from "./hooks/useMediaQuery";
import useSocketInit from "./hooks/useSocketInit"
import { Outlet } from "react-router-dom";
import { useAppContext } from "./context/appContext";

function App() {
  const desktopScreen = useMediaQuery("(min-width: 880px)");
  const {sidebarOpen, setSidebarOpen} = useAppContext();

  useSocketInit();
  return (
    <div className="h-screen flex relative">
      {(desktopScreen || sidebarOpen) && <div className="w-[80%] sm:w-[50%] md:w-[20em] lg:w-[25em] absolute desktop:static h-full"><Sidebar /></div>}
      
      {!sidebarOpen && <div className="absolute top-[15%] p-4 rounded-r-full -left-3 bg-accent cursor-pointer desktop:hidden z-10" onClick={() => setSidebarOpen(prev => !prev)}>
        <MenuIcon color="white"/>
      </div>}

      <div className="flex-1"><Outlet /></div>
    </div>
  )
}

export default App