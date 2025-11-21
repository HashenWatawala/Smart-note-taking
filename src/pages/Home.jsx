'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import Hook for redirection

// Components
import { Navbar } from '../components/navbar/Navbar';
import NoteCard from '../components/notes/NoteCard';
import NoteEditor from '../components/notes/NoteEditor';

// Logic Hooks & Utils
import useIndexedDB from '../hooks/useIndexedDB'; 
import { saveNoteToFirebase } from '../utils/firebaseSync'; 
import { auth } from '../firebase/config';

export default function HomePage() {
    // --- Hooks ---
    const navigate = useNavigate(); // Used to redirect to login
    const { notes, addNote, removeNote, updateNote } = useIndexedDB();
    
    // --- State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [currentTheme, setCurrentTheme] = useState('dark');

    // --- Theme Listener (Syncs JS with CSS classes) ---
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    setCurrentTheme(isDark ? 'dark' : 'light');
                }
            });
        });
        // Initial check
        if (document.documentElement.classList.contains('light')) setCurrentTheme('light');
        
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // --- HANDLERS ---

    // 1. Open Modal for New Note
    const handleOpenNewNote = () => {
        setNoteToEdit(null);
        setIsEditorOpen(true);
    };

    // 2. Open Modal for Editing
    const handleEditClick = (note) => {
        setNoteToEdit(note);
        setIsEditorOpen(true);
    };

    // 3. Save (Create or Update Local DB)
    const handleSaveNote = async (noteData) => {
        if (noteToEdit) {
            // Update existing
            await updateNote(noteToEdit.id, {
                ...noteData,
                status: 'Unsynced' // Edits revert to unsynced until shared again
            });
        } else {
            // Create new
            await addNote(noteData.title, noteData.content);
        }
        setIsEditorOpen(false);
        setNoteToEdit(null);
    };

    // 4. Delete Local Note
    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            await removeNote(id);
        }
    };

    // --- 5. SHARE HANDLER (The Logic You Asked For) ---
    const handleShareClick = async (note) => {
        const user = auth.currentUser;
        
        // A. GUEST CHECK: If not logged in, go to Sign In
        if (!user) {
            const shouldLogin = window.confirm("You must log in to generate a shareable link.\n\nGo to Login page?");
            if (shouldLogin) {
                navigate('/signin'); // <--- REDIRECTS HERE
            }
            return;
        }

        // B. USER LOGGED IN: Proceed to Sync
        try {
            // 1. Mark local note as synced
            const updatedNote = { 
                ...note, 
                status: 'Synced',
                lastUpdated: Date.now() 
            };

            // 2. Save to Firebase Realtime DB (Path: notes/userID/noteID)
            await saveNoteToFirebase(user.uid, updatedNote);

            // 3. Update IndexedDB so the UI shows "Synced"
            await updateNote(note.id, updatedNote);

            // 4. Generate Link
            const shareUrl = `${window.location.origin}/shared/${user.uid}/${note.id}`;
            
            // 5. Copy to Clipboard
            navigator.clipboard.writeText(shareUrl);
            alert(`Note Synced! Public link copied:\n\n${shareUrl}`);

        } catch (error) {
            console.error("Error sharing note:", error);
            alert("Failed to sync note. Check your internet connection.");
        }
    };

    // Filter notes for search
    const filteredNotes = notes.filter((note) => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- RENDER ---
    return (
        <div className={`min-h-screen transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-[#0a0e17]' : 'bg-gray-100'}`}>
            
            <Navbar />

            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                {/* Header & New Note Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold tracking-tight ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            My Notes
                        </h1>
                        <p className={`mt-1 text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                        </p>
                    </div>

                    <button 
                        onClick={handleOpenNewNote}
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                        + New Note
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-10">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`block w-full pl-4 py-3 rounded-xl border outline-none transition-all focus:ring-2
                            ${currentTheme === 'dark' 
                                ? 'bg-[#161f2e] border-gray-800 text-gray-200 focus:ring-indigo-500/20' 
                                : 'bg-white border-gray-200 text-gray-900 focus:ring-indigo-500/20'}
                        `}
                    />
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <NoteCard 
                            key={note.id} 
                            note={{
                                ...note,
                                // Formatting for UI
                                time: note.time || new Date(note.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                                status: note.status || 'Unsynced' 
                            }} 
                            theme={currentTheme} 
                            // Passing handlers
                            onClick={(n) => handleEditClick(n)}
                            onEdit={(n) => handleEditClick(n)}
                            onDelete={(id) => handleDeleteClick(id)} 
                            onShare={(n) => handleShareClick(n)} 
                        />
                    ))}
                    
                    {/* Empty State */}
                    {filteredNotes.length === 0 && (
                        <div className="col-span-full text-center py-12 opacity-50">
                            <p className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {searchQuery ? "No matching notes found." : "No notes yet. Create one!"}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Editor Modal */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-lg">
                        <button 
                            onClick={() => setIsEditorOpen(false)}
                            className="absolute -top-12 right-0 text-gray-400 hover:text-white"
                        >
                            Close
                        </button>
                        <NoteEditor 
                            theme={currentTheme} 
                            onAddNote={handleSaveNote} 
                            initialData={noteToEdit} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}