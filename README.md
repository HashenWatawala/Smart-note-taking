# Smart Note

Smart Note is a modern, offline-first note-taking web application built with React and Vite. It allows users to create, edit, delete, and search notes locally using IndexedDB. Users can also sign in with Firebase Authentication to sync and share notes via public links backed by Firebase Realtime Database.

## Features

- Create, edit, and delete notes locally with instant updates
- Search notes with real-time filtering
- Share notes via generated public URLs after signing in
- Offline-first experience with IndexedDB local storage
- Sync notes with Firebase Realtime Database for sharing
- User authentication with Firebase Authentication
- Responsive UI with light and dark themes using TailwindCSS
- Smooth modal-based note editor and note cards grid layout

## Technology Stack

- React 19
- Vite for fast development and bundling
- Firebase (Authentication & Realtime Database)
- IndexedDB for offline local storage
- TailwindCSS for styling and themes
- React Router for routing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smart-note
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

- Start the development server with hot reloading:
  ```bash
  npm run dev
  ```

- Build the production-ready files:
  ```bash
  npm run build
  ```

- Preview the production build locally:
  ```bash
  npm run preview
  ```

## Contributing

Contributions are welcome! Please open issues or pull requests to suggest improvements or report bugs.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
