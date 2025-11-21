import { useEffect, useState } from "react";
import { getAllNotes, saveNote, deleteNote } from "../utils/indexedDB";
import { v4 as uuidv4 } from "uuid";

export default function useIndexedDB() {
  const [notes, setNotes] = useState([]);

  // Load notes when app starts
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await getAllNotes();
    setNotes(data);
  };

  const addNote = async (title, content) => {
    const newNote = {
      id: uuidv4(),
      title,
      content,
      lastUpdated: Date.now(),
    };

    await saveNote(newNote);
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = async (id, updatedData) => {
    const updated = {
      ...updatedData,
      id,
      lastUpdated: Date.now(),
    };

    await saveNote(updated);
    setNotes(prev =>
      prev.map(n => (n.id === id ? updated : n))
    );
  };

  const removeNote = async (id) => {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return {
    notes,
    addNote,
    updateNote,
    removeNote,
  };
}
