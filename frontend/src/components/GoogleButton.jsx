import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../utils/firebase";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";

const GoogleButton = () => {
  const { setUserInfo } = useContext(UserContext);
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (user) => {
        console.log(user);
        setUserInfo({
          uid: user.uid,
          email: user.email,
          CfId: null,
        });
        toast.success("Registered Successfully");
      })
      .catch((err) => {
        toast.error(err.code.split("/")[1]);
      });
  }
  return (
    <div
      onClick={googleLogin}
      className="flex items-center w-3/5 bg-blue-400 gap-1 p-1 rounded-sm cursor-pointer"
    >
      <span className="bg-white p-1">
        <FcGoogle className="text-3xl" />
      </span>
      <span className="text-center w-full">
        <span className="text-white text-lg ">Sign Up with Google</span>
      </span>
    </div>
  );
};

export default GoogleButton;
