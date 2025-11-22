import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Navbar } from '../components/navbar/Navbar';
import NoteCard from '../components/notes/NoteCard'; // Import NoteCard for the grid view

// Firebase imports
import { db } from '../firebase/config';
import { ref, get, child } from "firebase/database";

export default function SharedNoteView() {
    const { userId, noteId } = useParams();
    const navigate = useNavigate();
    
    // State
    const [singleNote, setSingleNote] = useState(null);
    const [allNotes, setAllNotes] = useState([]); // Store all notes here
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTheme, setCurrentTheme] = useState('dark');

    const isSingleView = userId && noteId; // Boolean flag to decide view mode

    // --- 1. Fetch Logic ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const dbRef = ref(db);

            try {
                if (isSingleView) {
                    // A. FETCH SINGLE NOTE
                    const snapshot = await get(child(dbRef, `notes/${userId}/${noteId}`));
                    if (snapshot.exists()) {
                        setSingleNote(snapshot.val());
                    } else {
                        setError("Note not found or link is invalid.");
                    }
                } else {
                    // B. FETCH ALL NOTES (Explore Mode)
                    const snapshot = await get(child(dbRef, `notes`));
                    if (snapshot.exists()) {
                        const data = snapshot.val(); // Returns { userId1: { noteId1: {...} }, userId2: {...} }
                        
                        // Flatten the Firebase object structure into an array
                        const flattenedNotes = [];
                        
                        Object.keys(data).forEach(uId => {
                            const userNotes = data[uId];
                            Object.keys(userNotes).forEach(nId => {
                                flattenedNotes.push({
                                    ...userNotes[nId],
                                    id: nId, // Ensure ID is part of object
                                    authorId: uId // Optional: track who created it
                                });
                            });
                        });

                        setAllNotes(flattenedNotes);
                    } else {
                        setError("No shared notes found yet.");
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Error loading data from cloud.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, noteId, isSingleView]);

    // --- 2. Theme Logic ---
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    setCurrentTheme(isDark ? 'dark' : 'light');
                }
            });
        });
        if (document.documentElement.classList.contains('light')) setCurrentTheme('light');
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // --- Handler for clicking a note in "All View" ---
    const handleCardClick = (note, authorId) => {
        // Navigate to the specific view
        navigate(`/shared/${authorId}/${note.id}`);
    };

    // --- Render ---
    return (
        <div className={`min-h-screen transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-[#0a0e17]' : 'bg-gray-100'}`}>
            <Navbar />

            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-indigo-500 font-semibold animate-pulse">
                            {isSingleView ? "Loading note..." : "Loading community notes..."}
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex justify-center items-center h-64 text-red-500 font-bold text-xl">
                        {error}
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* CASE A: SINGLE NOTE VIEW */}
                        {isSingleView && singleNote && (
                            <div className="flex justify-center">
                                <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${currentTheme === 'dark' ? 'bg-[#161f2e] border-gray-800' : 'bg-white border-gray-200'}`}>
                                    <div className={`px-8 py-6 border-b ${currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                                        <h1 className={`text-3xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {singleNote.title}
                                        </h1>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-bold uppercase tracking-wide">
                                                Synced
                                            </span>
                                            <span className={`text-xs ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {new Date(singleNote.lastUpdated).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`p-8 text-lg leading-relaxed whitespace-pre-wrap ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                        {singleNote.content}
                                    </div>
                                    {/* Back Button */}
                                    <div className={`p-4 border-t ${currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                                        <button onClick={() => navigate('/shared')} className="text-sm text-indigo-500 hover:underline">
                                            &larr; Browse all shared notes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CASE B: ALL NOTES GRID VIEW */}
                        {!isSingleView && (
                            <div>
                                <div className="mb-8">
                                    <h1 className={`text-3xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Community Notes
                                    </h1>
                                    <p className={`mt-2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Explore notes shared by other users.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {allNotes.map((n) => (
                                        <NoteCard 
                                            key={n.id}
                                            note={{
                                                ...n,
                                                time: new Date(n.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                                                status: 'Synced'
                                            }}
                                            theme={currentTheme}
                                            // When clicking a card in explore mode, open the specific view
                                            onClick={() => handleCardClick(n, n.authorId)}
                                            // Hide edit/delete buttons for shared view (read-only)
                                            onEdit={null}
                                            onDelete={null}
                                            onShare={() => {
                                                const url = `${window.location.origin}/shared/${n.authorId}/${n.id}`;
                                                navigator.clipboard.writeText(url);
                                                alert("Link copied!");
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}