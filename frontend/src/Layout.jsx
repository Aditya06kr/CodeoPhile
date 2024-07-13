import React, { useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { UserContext } from "./UserContext";
import { auth } from "./utils/firebase";
import axios from "axios";

const Layout = () => {
  const { userInfo,setUserInfo } = useContext(UserContext);

  useEffect(() => {
    console.log(userInfo?.email);
    console.log(userInfo?.cfId);
    if (userInfo) {
      axios
        .get(`/user/dashboard/${userInfo.email}`)
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            setUserInfo((prevUserInfo) => ({
              ...prevUserInfo,
              CfId: res.data.CfId,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userInfo?.email]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setUserInfo({
          uid: user.uid,
          email: user.email,
          CfId: null,
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
