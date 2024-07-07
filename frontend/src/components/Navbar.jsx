import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'

const Navbar = () => {
  const {userInfo}=useContext(UserContext);
  return (
    <>
      <div className='flex justify-between p-4 bg-color1 text-white'>
        <div className='p-2'><Link to={"/"}>CodeoPhile</Link></div>
        <div>
          <div className='flex gap-10 p-2 bg-color1' >
            <Link to={"/"}>Home</Link>
            <Link to={"/dashboard"}>Dashboard</Link>
            {userInfo ? <Link to={"/profile"}>Profile</Link> : <Link to={"/register"}>SignUp</Link>}
            {userInfo ? <Link to={"/logout"}>Logout</Link> : <Link to={"/login"}>Login</Link>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar