import React from "react";
import { Routes, Route } from "react-router-dom";
import '../App.css';

// Page Imports
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import HomePage from "../pages/Home.jsx"; // Ensure filename matches
import SharedNoteView from "../pages/SharedNoteView.jsx";
// import PrivateRoute from "../utils/PrivateRoute.jsx"; // Not needed for Home in this logic

const AppRoutes = () => {
  return (
    <Routes>

      {/* --- Public Routes --- */}
      
      {/* 1. Home is Public (Guests can create notes locally) */}
      <Route path="/" element={<HomePage />} />
      
      {/* 2. Auth Pages */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* 3. Shared Note View (Dynamic Route) 
          This captures the User ID and Note ID from the URL 
          Example: domain.com/shared/user123/note456 
      */}
      <Route path="/shared/:userId/:noteId" element={<SharedNoteView />} />

    </Routes>
  );
};

export default AppRoutes;