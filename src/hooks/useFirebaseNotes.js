import { useEffect } from "react";
import { saveNoteToFirebase, subscribeToFirebaseNotes } from "../utils/firebaseSync";
import { auth } from "../firebase/config";

export default function useFirebaseNotes({ notes, setNotes, isOnline }) {

  // Subscribe to Firebase changes
  useEffect(() => {
    if (!isOnline) return;
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = subscribeToFirebaseNotes(user.uid, (cloudNotes) => {
      // Merge cloud notes with local IndexedDB notes
      // Compare lastUpdated to decide which to keep
      const mergedNotes = mergeNotes(notes, cloudNotes);
      setNotes(mergedNotes);
    });

    return () => unsubscribe();
  }, [isOnline, notes]);

  const saveNote = async (note) => {
    if (!isOnline) return;
    const user = auth.currentUser;
    if (!user) return;

    await saveNoteToFirebase(user.uid, note);
  };

  return { saveNote };
}

/**
 * Merge local and cloud notes based on lastUpdated
 */
const mergeNotes = (localNotes, cloudNotes) => {
  const merged = [...localNotes];

  cloudNotes.forEach(cNote => {
    const index = merged.findIndex(n => n.id === cNote.id);
    if (index === -1) {
      merged.push(cNote); // new note from cloud
    } else if (cNote.lastUpdated > merged[index].lastUpdated) {
      merged[index] = cNote; // cloud note is newer
    }
  });

  return merged;
};
