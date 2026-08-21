import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import "./NoteCard.css";

function NoteCard({ note }) {
  const navigate = useNavigate();

  const formattedDate = new Date(note.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3>{note.title}</h3>

        <button
          type="button"
          className="edit-note-btn"
          onClick={() => navigate(`/notes/${note.id}/edit`)}
          aria-label={`Edit ${note.title}`}
        >
          <Pencil size={17} strokeWidth={2} />
        </button>
      </div>

      <p>
        {note.content.length > 120
          ? `${note.content.substring(0, 120)}...`
          : note.content}
      </p>

      <small>{formattedDate}</small>
    </div>
  );
}

export default NoteCard;