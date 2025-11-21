// src/pages/SignUp.jsx
import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar.jsx';
import SignUpForm from '../components/auth/SignUpForm.jsx';
const SignUp = () => {
  // Default theme is dark
  const [theme, setTheme] = useState('dark');

  // Theme toggle (optional)
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Background based on theme (but form stays dark)
  const bgClass =
    theme === 'dark'
      ? 'bg-[#0E1525] text-white'
      : 'bg-gray-100 text-gray-900';

  return (
    <div
      className={`w-full min-h-screen ${bgClass} transition-colors duration-300 font-sans`}
    >
      {/* Navbar takes theme + toggle */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Sign Up Form Centered */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-24 pb-8 px-4">
        <SignUpForm theme="dark" /> 
        {/* Force form to stay in dark mode */}
      </main>
    </div>
  );
};

export default SignUp;
