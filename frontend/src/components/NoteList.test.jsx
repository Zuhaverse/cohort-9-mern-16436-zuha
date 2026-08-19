import { render, screen } from "@testing-library/react";
import NoteList from "./NoteList";

test("renders all notes", () => {
  const notes = [
    {
      id: 1,
      title: "First Note",
      content: "Learning MERN stack",
      created_at: "2026-08-18T10:00:00.000Z",
    },
    {
      id: 2,
      title: "Second Note",
      content: "Building NoteSpace",
      created_at: "2026-08-19T10:00:00.000Z",
    },
  ];

  render(<NoteList notes={notes} />);

  expect(screen.getByText("First Note")).toBeInTheDocument();
  expect(screen.getByText("Learning MERN stack")).toBeInTheDocument();

  expect(screen.getByText("Second Note")).toBeInTheDocument();
  expect(screen.getByText("Building NoteSpace")).toBeInTheDocument();
});