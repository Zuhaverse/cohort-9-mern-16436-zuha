import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NoteCard from "./NoteCard";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function () {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = jest.fn(function () {
    this.open = false;
  });
});

describe("NoteCard delete flow", () => {
  const note = {
    id: 1,
    title: "Test Note",
    content: "This is a test note.",
    created_at: "2026-08-21T10:00:00.000Z",
  };

  test("confirms and deletes a note", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn().mockResolvedValue();

    render(
      <MemoryRouter>
        <NoteCard note={note} onDelete={onDelete} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByRole("button", {
      name: "Delete Test Note",
    });

    await user.click(deleteButton);

    expect(
      screen.getByRole("heading", { name: "Delete Note?" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", {
      name: "Delete",
    });

    await user.click(confirmButton);

    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("moves focus to Delete when Shift+Tab is pressed from Cancel", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn().mockResolvedValue();

    render(
      <MemoryRouter>
        <NoteCard note={note} onDelete={onDelete} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByRole("button", {
      name: "Delete Test Note",
    });

    await user.click(deleteButton);

    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });

    const confirmDeleteButton = screen.getByRole("button", {
      name: "Delete",
    });

    expect(cancelButton).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");

    expect(confirmDeleteButton).toHaveFocus();
  });

  test("closes delete dialog with Cancel and restores focus", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn().mockResolvedValue();

    render(
      <MemoryRouter>
        <NoteCard note={note} onDelete={onDelete} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByRole("button", {
      name: "Delete Test Note",
    });

    await user.click(deleteButton);

    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });

    await user.click(cancelButton);

    expect(
      screen.queryByRole("heading", { name: "Delete Note?" })
    ).not.toBeInTheDocument();

    expect(deleteButton).toHaveFocus();
  });

  test("opens the note view dialog", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <MemoryRouter>
        <NoteCard note={note} onDelete={onDelete} />
      </MemoryRouter>
    );

    const viewButton = screen.getByRole("button", {
      name: "View Test Note",
    });

    await user.click(viewButton);

    expect(
      screen.getByRole("heading", { name: "Test Note", level: 2 })
    ).toBeInTheDocument();

    expect(
      screen.getByText("This is a test note.", { selector: ".note-view-content" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close note" })
    ).toBeInTheDocument();
  });

  test("closes note view with the close button and restores focus", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <MemoryRouter>
        <NoteCard note={note} onDelete={onDelete} />
      </MemoryRouter>
    );

    const viewButton = screen.getByRole("button", {
      name: "View Test Note",
    });

    await user.click(viewButton);

    const closeButton = screen.getByRole("button", {
      name: "Close note",
    });

    await user.click(closeButton);

    expect(
      screen.queryByRole("button", { name: "Close note" })
    ).not.toBeInTheDocument();

    expect(viewButton).toHaveFocus();
  });

  test("closes note view with Escape and restores focus", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <MemoryRouter>
        <NoteCard note={note} onDelete={onDelete} />
      </MemoryRouter>
    );

    const viewButton = screen.getByRole("button", {
      name: "View Test Note",
    });

    await user.click(viewButton);

    expect(
      screen.getByRole("heading", { name: "Test Note", level: 2 })
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("button", { name: "Close note" })
    ).not.toBeInTheDocument();

    expect(viewButton).toHaveFocus();
  });
});
