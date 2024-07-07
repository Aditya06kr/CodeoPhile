import { React, useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleButton from "../components/GoogleButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userInfo, setUserInfo } = useContext(UserContext);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      setUserInfo({
        uid: user.uid,
        email: user.email,
        CfId: null,
      });

      toast.success("User logged in");
    } catch (err) {
      toast.error(err.code.split("/")[1]);
    }
  }

  if (userInfo) return <Navigate to={"/dashboard"} />;

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-color1">
        <form
          onSubmit={handleLogin}
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
            placeholder="Password"
            className="w-full p-2 outline-none"
          />
          <button type="submit" className="p-2 rounded-sm bg-blue-100 w-full">
            Login
          </button>

          <span className="">~~~~~~~~~~~~~Or~~~~~~~~~~~~~</span>
          <GoogleButton />
        </form>
      </div>
    </>
  );
};

export default LoginPage;
