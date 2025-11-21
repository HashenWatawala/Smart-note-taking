// src/pages/SharedNoteView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';

// Firebase imports
import { db } from '../firebase/config';
import { ref, get, child } from "firebase/database";

export default function SharedNoteView() {
    const { userId, noteId } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTheme, setCurrentTheme] = useState('dark');

    // --- 1. Fetch Note from Firebase ---
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const dbRef = ref(db);
                // Path matches: notes / userId / noteId
                const snapshot = await get(child(dbRef, `notes/${userId}/${noteId}`));

                if (snapshot.exists()) {
                    setNote(snapshot.val());
                } else {
                    setError("Note not found");
                }
            } catch (err) {
                console.error(err);
                setError("Error loading note");
            } finally {
                setLoading(false);
            }
        };

        if (userId && noteId) fetchNote();
    }, [userId, noteId]);

    // --- 2. Theme Logic (Standard) ---
    useEffect(() => {
        // ... (Keep your existing theme logic here) ...
        const isDark = document.documentElement.classList.contains('dark');
        setCurrentTheme(isDark ? 'dark' : 'light');
    }, []);

    // --- Render ---
    return (
        <div className={`min-h-screen transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-[#0a0e17]' : 'bg-gray-100'}`}>
            <Navbar />

            <main className="pt-24 px-4 flex justify-center items-center min-h-[80vh]">
                {loading && (
                    <div className="text-indigo-500 font-semibold animate-pulse">Loading shared note...</div>
                )}

                {error && (
                    <div className="text-red-500 font-bold text-xl">{error}</div>
                )}

                {!loading && !error && note && (
                    <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${currentTheme === 'dark' ? 'bg-[#161f2e] border-gray-800' : 'bg-white border-gray-200'}`}>
                        {/* Header */}
                        <div className={`px-8 py-6 border-b ${currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                            <h1 className={`text-3xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {note.title}
                            </h1>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-bold uppercase tracking-wide">
                                    Public Shared Note
                                </span>
                                <span className={`text-xs ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {new Date(note.lastUpdated).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`p-8 text-lg leading-relaxed whitespace-pre-wrap ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            {note.content}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}