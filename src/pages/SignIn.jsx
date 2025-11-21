// src/pages/SignIn.jsx
import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar.jsx';
import SignInForm from '../components/auth/SignInForm.jsx';

const SignIn = () => {
  // Shared theme state
  const [theme, setTheme] = useState('dark');

  // Theme toggle function
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Page background class based on theme
  const bgClass = theme === 'dark' ? 'bg-[#0E1525] text-white' : 'bg-gray-100 text-gray-900';

  return (
    <div className={`w-full min-h-screen ${bgClass} transition-colors duration-300 font-sans`}>
      {/* Navbar receives theme and toggle function */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Centered form */}
      <main className="flex flex-col items-center justify-center pt-24 pb-8 min-h-screen px-4">
        <SignInForm theme={theme} />
      </main>
    </div>
  );
};

export default SignIn;
