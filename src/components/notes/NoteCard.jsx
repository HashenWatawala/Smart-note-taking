import React from "react";

// --- Icons ---
const EditIcon = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>;
const TrashIcon = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const ShareIcon = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;

// --- Status/Sync Icon ---
const StatusIcon = ({ status, theme }) => {
  // Check against "Synced" string or boolean true
  const isSynced = status === 'Synced' || status === true;
  
  const colorClass = isSynced 
    ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') 
    : (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600');
    
  return (
    <div className={`flex items-center gap-1 text-xs font-semibold ${colorClass}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isSynced 
          ? <polyline points="20 6 9 17 4 12" /> // Checkmark
          : <path d="M12 2v10M12 22v-10M5 12h14" transform="rotate(90 12 12)" /> // Sync/Circle icon
        }
      </svg>
      {isSynced ? 'Synced' : 'Unsynced'}
    </div>
  );
};

// --- Action Button Component ---
const ActionButton = ({ onClick, icon: Icon, label, theme, variant = 'default' }) => {
  const hoverClass = variant === 'danger' 
    ? (theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600')
    : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900');

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering the card click
        onClick();
      }}
      className={`p-2 rounded-full transition-colors duration-200 ${hoverClass}`}
      title={label}
    >
      <Icon size={18} />
    </button>
  );
};

// --- Single Note Card Component ---
const NoteCard = ({ note, theme, onClick, onEdit, onDelete, onShare }) => {
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
        group relative flex flex-col justify-between
        rounded-xl p-5 shadow-xl border ${borderColor} 
        ${cardBgClass} transition-all duration-200 cursor-pointer w-full max-w-sm mx-auto h-64
      `}
      onClick={() => onClick && onClick(note)}
    >
      {/* Content Section */}
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold truncate w-3/4 ${titleColor}`}>
            {note.title}
          </h3>
          <StatusIcon status={note.status} theme={theme} />
        </div>

        <p className={`text-sm mb-4 line-clamp-4 ${contentColor}`}>
          {note.content}
        </p>
      </div>

      {/* Footer Section: Timestamp & Actions */}
      <div className="mt-auto">
        <div className={`flex items-center text-xs mb-3 ${timeColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {note.time || new Date(note.lastUpdated).toLocaleTimeString()}
        </div>

        {/* Action Buttons (Divider + Row) */}
        <div className={`flex items-center justify-between border-t pt-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-1">
               <ActionButton onClick={() => onShare && onShare(note)} icon={ShareIcon} label="Share" theme={theme} />
               <ActionButton onClick={() => onEdit && onEdit(note)} icon={EditIcon} label="Edit" theme={theme} />
            </div>
            
            <ActionButton onClick={() => onDelete && onDelete(note.id)} icon={TrashIcon} label="Delete" theme={theme} variant="danger" />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;