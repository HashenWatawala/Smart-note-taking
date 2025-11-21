import React from "react";
import '../App.css'
import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import Home from "../pages/Home.jsx";
import PrivateRoute from "../utils/PrivateRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}

    </Routes>
  );
};

export default AppRoutes;
