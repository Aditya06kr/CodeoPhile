import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="bg-slate-500">Header</div>
      <Outlet/>
    </>
  );
};

export default Layout;
