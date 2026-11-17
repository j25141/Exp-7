import { useState, useEffect } from 'react';

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editId) {
      // UPDATE
      setNotes(notes.map(n => (n.id === editId ? { ...n, title, content } : n)));
      setEditId(null);
    } else {
      // ADD
      setNotes([{ id: Date.now(), title, content }, ...notes]);
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // DELETE
  const handleDelete = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    if (editId === id) { setEditId(null); setTitle(''); setContent(''); }
  };

  return (
    <div className="app">
      <h1>My Notes</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note..." rows="4" />
        <button type="submit">{editId ? 'Update Note' : 'Add Note'}</button>
      </form>

      <div className="notes">
        {notes.length === 0 && <p className="empty">No notes yet.</p>}
        {notes.map(note => (
          <div className="note" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="actions">
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button className="del" onClick={() => handleDelete(note.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
