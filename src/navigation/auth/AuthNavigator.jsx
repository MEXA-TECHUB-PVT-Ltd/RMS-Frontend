import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../../views/Auth/Login";

const AuthNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default AuthNavigator;
