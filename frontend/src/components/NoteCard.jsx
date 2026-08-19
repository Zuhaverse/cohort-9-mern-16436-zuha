import "./NoteCard.css";

function NoteCard({ note }) {
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
      <h3>{note.title}</h3>
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