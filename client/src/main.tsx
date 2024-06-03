import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './context/authContext.tsx'
import ProtectedComponent from './component/ProtectedComponent.tsx'
import ChatPage from './pages/ChatPage.tsx'
import { ChatContextProvider } from './context/chatContext.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <ProtectedComponent>
      <App />
    </ProtectedComponent>,
    children: [
      {
        path: "/:chatId",
        element: <ChatPage />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  }
])

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
        </QueryClientProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  //</React.StrictMode>,
)
