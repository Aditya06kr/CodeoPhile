import { React, useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Divider } from "antd";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";
import GoogleButton from "../components/GoogleButton";
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {userInfo,setUserInfo}=useContext(UserContext);

  async function handleRegister(e) {
    e.preventDefault();
    if(password!==confirmPassword){
        toast.warn("Password not Matched");
        return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      setUserInfo({
        uid: user.uid,
        email: user.email,
      });
      toast.success("User registered Successfully");
    } catch (err) {
      toast.error(err.code.split("/")[1]);
    }
  }

  if (userInfo) return <Navigate to={"/"} />;

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-slate-700">
        <form
          onSubmit={handleRegister}
          className="flex flex-col justify-center items-center w-96 gap-2"
        >
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Id"
            className="w-full p-2 outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="w-full p-2 outline-none"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 outline-none"
          />
          <button type="submit" className="p-2 rounded-sm bg-blue-100 w-full">
            Sign Up
          </button>

          <Divider>Or</Divider>
          <GoogleButton/>
          
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
