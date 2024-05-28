import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedComponent = ({children}: PropsWithChildren) => {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", {replace: true});
    }
  }, [user]);
  
  return children;
}

export default ProtectedComponent