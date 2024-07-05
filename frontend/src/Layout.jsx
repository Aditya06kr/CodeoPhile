import React, { useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { UserContext } from "./UserContext";
import { auth } from "./utils/firebase";

const Layout = () => {
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserInfo({
          uid: user.uid,
          email: user.email,
        });
      } else setUserInfo(null);
      console.log(user);
    });
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
