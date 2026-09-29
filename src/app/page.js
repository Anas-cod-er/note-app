"use client"
import { useState, useEffect } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

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
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">My Notes</h1>
          <p className="text-gray-400">Create, Read, Update and delete your notes</p>
        </div>
        <form onSubmit={createNote} className="mb-8 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 min-h-[100px]"
          />
          <button type="submit" className="bg-yellow-400 text-gray-950 px-6 py-2 rounded font-semibold hover:bg-yellow-300">
            Add Note
          </button>
        </form>
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-gray-900 p-4 rounded border border-gray-700 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">{note.title}</h3>
                <p className="text-gray-300 mt-1">{note.content}</p>
                <small className="text-gray-500">{new Date(note.createdAt).toLocaleString()}</small>
              </div>
              <button
                onClick={() => deleteNote(note._id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
          {notes.length === 0 && <p className="text-gray-500 text-center py-8">No notes yet. Create one above!</p>}
        </div>
      </div>
    </div>
  );
}
