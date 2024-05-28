import Chat from "./component/Chat"
import Sidebar from "./component/Sidebar"

function App() {
  return (
    <div className="h-screen flex">
      <div className="w-[30%]"><Sidebar /></div>
      <div className="flex-1"><Chat /></div>
    </div>
  )
}

export default App
