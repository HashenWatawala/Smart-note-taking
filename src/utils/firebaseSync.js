import { ref, set, onValue } from "firebase/database";
import { db } from "../firebase/config";

/**
 * Save or update a single note to Firebase
 */
export const saveNoteToFirebase = async (userId, note) => {
  await set(ref(db, `notes/${userId}/${note.id}`), note);
};

/**
 * Listen for real-time updates from Firebase
 */
export const subscribeToFirebaseNotes = (userId, callback) => {
  const notesRef = ref(db, `notes/${userId}`);
  onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Convert object to array
      const notesArray = Object.values(data);
      callback(notesArray);
    } else {
      callback([]);
    }
  });
};
