import Sidebar from "./component/Sidebar"

function App() {
  return (
    <div className="h-screen flex">
      <div className="w-[25%]"><Sidebar /></div>
      <div className="flex-1"></div>
      <div className="w-[20%]"></div>
    </div>
  )
}

export default App
