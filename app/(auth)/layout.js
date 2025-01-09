import React from "react";
import dynamic from "next/dynamic";

const AuthLayout = ({ children }) => {
  return <div className="flex justify-center pt-20">{children}</div>;
};

export default AuthLayout;
