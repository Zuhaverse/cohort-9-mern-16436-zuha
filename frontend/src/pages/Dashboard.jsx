import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, deleteNote } from "../services/noteService";
import { useAuth } from "../context/useAuth";
import NoteList from "../components/NoteList";

import "./Dashboard.css";

function getPlainText(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    if (!showProfileMenu) {
      return;
    }
  
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
  
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowProfileMenu(false);
        profileButtonRef.current?.focus();
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showProfileMenu]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        setNotes(response.data);
      } catch{
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

  const handleDelete = async (id) => {
    try {
      setDeleteError("");
  
      await deleteNote(id);
  
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );
    } catch (error) {
      console.error("Delete note error:", error);
      setDeleteError("Failed to delete note. Please try again.");
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const search = searchTerm.toLowerCase().trim();
    const plainTextContent = getPlainText(note.content).toLowerCase();
  
    return (
      note.title.toLowerCase().includes(search) ||
      plainTextContent.includes(search)
    );
  });

  let notesContent;

if (notes.length === 0) {
  notesContent = (
    <div className="empty-state">
      <h2>Your space is empty</h2>
      <p>Create a note to get started.</p>

      <button
        type="button"
        className="create-note-btn"
        id="plus-btn"
        aria-label="Create note"
        onClick={() => navigate("/notes/new")}
      >
        +
      </button>
    </div>
  );
} else if (filteredNotes.length === 0) {
  notesContent = (
    <div className="empty-state">
      <h2>No notes found</h2>
      <p>Try searching with a different word.</p>
    </div>
  );
} else {
  notesContent = (
    <NoteList notes={filteredNotes} onDelete={handleDelete} />
  );
}

return (
  <div className="dashboard">
   <header className="dashboard-nav">
  <div className="brand">
    <span className="brand-name">NoteSpace</span>
  </div>
  <div className="dashboard-actions">
  <div className="search-wrapper">
    <input
      type="search"
      className="note-search"
      placeholder="Search your notes..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      aria-label="Search notes"
    />
  </div>
  {user && (
  <div className="user-profile-wrapper" ref={profileMenuRef}>
  <button
  ref={profileButtonRef}
    type="button"
    className="user-profile"
    onClick={() => setShowProfileMenu((current) => !current)}
    aria-expanded={showProfileMenu}
    aria-haspopup="true"
    aria-label={`Open profile menu for ${user.name}`}
  >
    <div className="user-avatar">
      {user.name?.charAt(0).toUpperCase()}
    </div>
  </button>

  {showProfileMenu && (
    <div className="profile-dropdown">
      <div className="dropdown-user-info">
        <div className="dropdown-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      </div>

      <button
        type="button"
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
)}

    <button
      type="button"
      className="create-note-btn"
      onClick={() => navigate("/notes/new")}
    >
      + Create Note
    </button>
  </div>
</header>
      {deleteError && (
  <p className="dashboard-message error" role="alert">
    {deleteError}
  </p>
)}

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <h1>My Notes</h1>
            <p>Keep your thoughts organized in one space.</p>
          </div>
        </div>
        {notesContent}
      </main>
    </div>
  );
}

export default Dashboard;