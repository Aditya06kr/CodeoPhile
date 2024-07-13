import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'
import { auth } from "../utils/firebase";

const Navbar = () => {
  const {userInfo,setUserInfo}=useContext(UserContext);
  async function logout() {
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
      <div className='flex justify-between p-4 bg-color1 text-white'>
        <div className='p-2'><Link to={"/"}>CodeoPhile</Link></div>
        <div>
          <div className='flex gap-10 p-2 bg-color1' >
            <Link to={"/"}>Home</Link>
            <Link to={"/dashboard"}>Dashboard</Link>
            {userInfo ? <Link to={`/profile/${userInfo.CfId}`}>Profile</Link> : <Link to={"/register"}>SignUp</Link>}
            {userInfo ? <button onClick={logout}>Logout</button> : <Link to={"/login"}>Login</Link>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar