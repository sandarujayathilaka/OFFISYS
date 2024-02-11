import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useLocalStorage('persist', false);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        
        await refresh();
        
      } catch (err) {
        
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      if (persist && auth?.accessToken) {
        await refresh();
        
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [persist, auth?.accessToken, refresh]);

  useEffect(() => {
   
  }, [isLoading, auth?.accessToken]);

  if (!persist) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-teal-900 text-white flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          className="bi bi-arrow-repeat animate-spin"
          viewBox="0 0 16 16"
        >
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
          <path
            fillRule="evenodd"
            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
          />
        </svg>
      </div>
    );
  }

  if (!auth?.accessToken) {
    navigate("/offsys"); // Redirect to the login page
    return null;
  }

  return <Outlet />;
};

export default PersistLogin;
