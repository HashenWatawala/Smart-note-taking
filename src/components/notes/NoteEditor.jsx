import React, { useState } from "react";

const NoteEditor = ({ theme }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Styles based on the theme
  const cardBgClass = theme === 'dark' ? 'bg-[#1F2937]/90' : 'bg-white';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBgColor = theme === 'dark' ? 'bg-[#121B27]' : 'bg-gray-50';
  const inputTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const placeholderColor = theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const buttonClass = "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg w-full transition-colors duration-200 shadow-md hover:shadow-lg";

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!title || !content) {
      console.error("Title and content cannot be empty.");
      return;
    }
    
    const newNote = {
      id: Date.now(),
      title,
      content,
      status: "Unsynced",
      time: new Date().toLocaleTimeString(),
    };
    
    // In a real application, you would call a prop function here:
    // onAddNote(newNote);
    console.log("New Note Added (Mock):", newNote);
    
    // Clear inputs
    setTitle('');
    setContent('');
  };

  return (
    <div 
      className={`
        rounded-xl p-6 sm:p-8 shadow-2xl border ${borderColor} 
        ${cardBgClass} w-full max-w-lg mx-auto transition-colors duration-300
      `}
    >
      <h2 className={`text-2xl font-bold mb-6 text-center ${titleColor}`}>
        Create New Note
      </h2>
      <form onSubmit={handleAddNote} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="noteTitle" className={`block text-sm font-medium mb-1 ${titleColor}`}>
            Title
          </label>
          <input
            id="noteTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Project Meeting Notes"
            className={`w-full p-3 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${inputBgColor} ${inputTextColor} ${placeholderColor}`}
          />
        </div>

        {/* Note Content Input */}
        <div>
          <label htmlFor="noteContent" className={`block text-sm font-medium mb-1 ${titleColor}`}>
            Note
          </label>
          <textarea
            id="noteContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            placeholder="Start typing your note content here..."
            className={`w-full p-3 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all ${inputBgColor} ${inputTextColor} ${placeholderColor}`}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className={buttonClass}
        >
          Add this note
        </button>
      </form>
    </div>
  );
};

export default NoteEditor;