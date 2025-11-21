import { openDB } from "idb";

const DB_NAME = "notes-db";
const STORE_NAME = "notes";

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

// Create or update a note
export async function saveNote(note) {
  const db = await dbPromise;
  await db.put(STORE_NAME, note);
}

// Get all notes
export async function getAllNotes() {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
}

// Get one note by ID
export async function getNoteById(id) {
  const db = await dbPromise;
  return await db.get(STORE_NAME, id);
}

// Delete note
export async function deleteNote(id) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
}

// Bulk save (useful for syncing Firebase → local)
export async function bulkSaveNotes(notes) {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readwrite");
  notes.forEach(n => tx.store.put(n));
  await tx.done;
}
