import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { refreshIdToken } from "../slices/user/userSlice";
import { persistedLoginRedirectRoutes } from "../utils/persistedLoginRedirectRoutes";
import Spinner from "../components/Spinner";

const PersistLogin = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const verifyRefreshToken = async () => {
    dispatch(refreshIdToken())
      .unwrap()
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    !user?.idToken && user?.persistLogin
      ? verifyRefreshToken()
      : setIsLoading(false);
  }, []);

  return (
    <>
      {!user?.persistLogin ? (
        <Outlet />
      ) : isLoading ? (
        <Spinner />
      ) : user?.idToken &&
        persistedLoginRedirectRoutes.includes(location.pathname) ? (
        <Navigate to="/home" state={{ from: location }} replace />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
