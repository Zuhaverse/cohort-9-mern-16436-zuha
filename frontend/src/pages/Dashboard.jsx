import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes } from "../services/noteService";
import NoteList from "../components/NoteList";
import logo from "../assets/logo.png";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        setNotes(response.data);
      } catch (error) {
        setError("Failed to load notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <p className="dashboard-message">Loading notes...</p>;
  }

  if (error) {
    return <p className="dashboard-message error">{error}</p>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-nav">
        <div className="brand">
          <img className="logo" src={logo} alt="NoteSpace logo" />
          <span className="brand-name">NoteSpace</span>
        </div>

        <button
          type="button"
          className="create-note-btn"
          onClick={() => navigate("/notes/new")}
        >
          + Create Note
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <h1>My Notes</h1>
            <p>Keep your thoughts organized in one space.</p>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <h2>No notes yet</h2>
            <p>Create your first note and start writing.</p>

            <button
              type="button"
              className="create-note-btn"
              onClick={() => navigate("/notes/new")}
            >
              Create your first note
            </button>
          </div>
        ) : (
          <NoteList notes={notes} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;