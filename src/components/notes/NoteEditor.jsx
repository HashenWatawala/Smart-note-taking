import React, { useState, useEffect } from "react";

const NoteEditor = ({ theme, onAddNote, initialData = null }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // --- Effect: Pre-fill data if editing ---
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialData]);

  // Styles
  const cardBgClass = theme === 'dark' ? 'bg-[#1F2937]' : 'bg-white';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBgColor = theme === 'dark' ? 'bg-[#121B27]' : 'bg-gray-50';
  const inputTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    // We just pass the data back. The parent (HomePage) decides if it's an add or update.
    onAddNote({
        title,
        content
    });
    
    // Don't clear immediately if we want to keep modal open, 
    // but usually parent closes modal.
    if (!initialData) {
        setTitle('');
        setContent('');
    }
  };

  return (
    <div className={`rounded-xl p-6 shadow-2xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${cardBgClass} w-full`}>
      <h2 className={`text-2xl font-bold mb-6 text-center ${titleColor}`}>
        {initialData ? 'Edit Note' : 'Create New Note'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={`w-full p-3 rounded-lg outline-none ${inputBgColor} ${inputTextColor}`}
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            placeholder="Note content..."
            className={`w-full p-3 rounded-lg outline-none resize-none ${inputBgColor} ${inputTextColor}`}
          />
        </div>
        <button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg w-full transition-colors"
        >
          {initialData ? 'Save Changes' : 'Add Note'}
        </button>
      </form>
    </div>
  );
};

export default NoteEditor;