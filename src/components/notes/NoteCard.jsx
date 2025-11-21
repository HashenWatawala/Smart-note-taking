import React from "react";

// --- Status/Sync Icon ---
const StatusIcon = ({ status, theme }) => {
  const isSynced = status === 'Synced';
  const colorClass = isSynced 
    ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') 
    : (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600');
    
  return (
    <div className={`flex items-center gap-1 text-xs font-semibold ${colorClass}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isSynced 
          ? <polyline points="20 6 9 17 4 12" /> // Checkmark
          : <path d="M12 2v10M12 22v-10M5 12h14" transform="rotate(90 12 12)" /> // Horizontal Sync/Circle icon
        }
      </svg>
      {status}
    </div>
  );
};

// --- Single Note Card Component ---
const NoteCard = ({ note, theme }) => {
  // Styles based on the theme
  const cardBgClass = theme === 'dark' ? 'bg-[#1F2937]/90 hover:bg-[#1F2937]' : 'bg-white hover:bg-gray-50';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const contentColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const timeColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  if (!note || !theme) return null;

  return (
    <div 
      className={`
        rounded-xl p-5 shadow-xl border ${borderColor} 
        ${cardBgClass} transition-all duration-200 cursor-pointer w-full max-w-sm mx-auto
      `}
      onClick={() => console.log(`Opening note: ${note.title}`)}
    >
      <div className="flex justify-between items-start mb-2">
        {/* Title */}
        <h3 className={`text-lg font-bold truncate ${titleColor}`}>
          {note.title}
        </h3>
        
        {/* Status Pill */}
        <StatusIcon status={note.status} theme={theme} />
      </div>

      {/* Content Snippet */}
      <p className={`text-sm mb-3 line-clamp-2 ${contentColor}`}>
        {note.content}
      </p>

      {/* Timestamp */}
      <div className={`flex items-center text-xs ${timeColor}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        {note.time}
      </div>
    </div>
  );
};

export default NoteCard;