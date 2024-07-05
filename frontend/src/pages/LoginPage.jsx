import React from "react";

const LoginPage = () => {
  return (
    <>
      <div className="h-screen flex justify-center items-center bg-slate-700">
        <div className="flex flex-col justify-center items-center bg-blue-100 w-2/4">
          <input type="text" placeholder="Email Id" />
          <input type="password" placeholder="Password" />
          <button>Sign In</button>
          <hr />
          <button>Sign in with Google</button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
