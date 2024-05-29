import ChatPage from "./pages/ChatPage"
import Sidebar from "./component/Sidebar"
import useSocketInit from "./hooks/useSocketInit"

function App() {
  useSocketInit();
  return (
    <div className="h-screen flex">
      <div className="w-[30%]"><Sidebar /></div>
      <div className="flex-1"><ChatPage /></div>
    </div>
  )
}

export default App
