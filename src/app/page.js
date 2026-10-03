"use client"
import {Poppins, Roboto_Mono} from "next/font/google";
import { useState, useEffect } from "react";
import localFont from "next/font/local";

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

const chewyFont = localFont({
  src: "../../public/Chewy-Regular.ttf"
})

const poppintFont = Poppins({
  subsets: ['latin'],
  weight: ["400", "700"],
  display: 'swap',
})

export default function Home() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("notes-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("notes-theme", nextTheme);
  }

  async function fetchNotes() {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  }

  async function createNote(e) {
    e.preventDefault();
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      fetchNotes();
    }
  }

  async function deleteNote(id) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  }

  return (
    <div className={`app-shell min-h-screen p-8 ${chewyFont.className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold app-title mb-2">My Notes</h1>
            <p className="app-subtitle">Create, Read, Update and delete your notes</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="theme-toggle"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
        <form onSubmit={createNote} className="mb-8 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="note-input w-full p-3 border rounded"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="note-input w-full p-3 border rounded min-h-[100px]"
          />
          <button type="submit" className="submit-button px-6 py-2 rounded font-semibold">
            Add Note
          </button>
        </form>
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="note-card p-4 rounded border flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold note-title">{note.title}</h3>
                <p className="note-content mt-1">{note.content}</p>
                <small className="note-date">{new Date(note.createdAt).toLocaleString()}</small>
              </div>
              <button
                onClick={() => deleteNote(note._id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
          {notes.length === 0 && <p className="empty-state text-center py-8">No notes yet. Create one above!</p>}
        </div>
      </div>
    </div>
  );
}
