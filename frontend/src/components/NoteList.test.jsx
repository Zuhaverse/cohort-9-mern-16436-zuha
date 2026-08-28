import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoteList from "./NoteList";

jest.mock("./NoteCard", () => {
  return function MockNoteCard({ note, onDelete }) {
    return (
      <div data-testid={`note-card-${note.id}`}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>

        <button onClick={() => onDelete(note.id)}>
          Delete {note.title}
        </button>
      </div>
    );
  };
});

describe("NoteList", () => {
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

  test("renders all notes", () => {
    render(
      <BrowserRouter>
        <NoteList notes={notes} onDelete={jest.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText("First Note")).toBeInTheDocument();
    expect(
      screen.getByText("Learning MERN stack")
    ).toBeInTheDocument();

    expect(screen.getByText("Second Note")).toBeInTheDocument();
    expect(
      screen.getByText("Building NoteSpace")
    ).toBeInTheDocument();
  });

  test("renders the correct number of note cards", () => {
    render(
      <BrowserRouter>
        <NoteList notes={notes} onDelete={jest.fn()} />
      </BrowserRouter>
    );

    expect(screen.getAllByTestId(/note-card-/)).toHaveLength(2);
  });

  test("renders empty list when there are no notes", () => {
    render(
      <BrowserRouter>
        <NoteList notes={[]} onDelete={jest.fn()} />
      </BrowserRouter>
    );

    expect(screen.queryByTestId(/note-card-/)).not.toBeInTheDocument();
  });

  test("passes delete handler to note cards", async () => {
    const onDelete = jest.fn();

    render(
      <BrowserRouter>
        <NoteList notes={notes} onDelete={onDelete} />
      </BrowserRouter>
    );

    screen.getByRole("button", {
      name: "Delete First Note",
    }).click();

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});