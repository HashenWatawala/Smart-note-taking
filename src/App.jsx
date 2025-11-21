import './App.css';
import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";

const App = () => {
  return (
    <>
      {/* You can add global styles, Navbar, or ThemeProvider here */}
      <AppRoutes />
    </>
  );
};

export default App;
