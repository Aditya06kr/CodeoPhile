import React from "react";
import { auth } from "../utils/firebase";
import { UserContext } from "../UserContext";
import { useContext, useEffect } from "react";

const HomePage = () => {
  const { setUserInfo } = useContext(UserContext);

  async function fun() {
    try {
      await auth.signOut();
      console.log("User logged out");
      setUserInfo(null);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div>HomePage</div>
      <button onClick={fun}>Logout</button>
    </>
  );
};

export default HomePage;
