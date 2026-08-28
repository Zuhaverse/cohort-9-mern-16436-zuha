import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NoteCard from "./NoteCard";

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

    try {
      await user.click(deleteButton);
    } catch (error) {
      throw new Error(
        `Failed to open delete confirmation dialog: ${error.message}`,
        { cause: error }
      );
    }

    expect(
      screen.getByRole("heading", { name: "Delete Note?" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", {
      name: "Delete",
    });

    try {
      await user.click(confirmButton);
    } catch (error) {
      throw new Error(
        `Failed to confirm note deletion: ${error.message}`,
        { cause: error }
      );
    }

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

    try {
      await user.click(deleteButton);
    } catch (error) {
      throw new Error(
        `Failed to open delete confirmation dialog for focus test: ${error.message}`,
        { cause: error }
      );
    }

    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });

    const confirmDeleteButton = screen.getByRole("button", {
      name: "Delete",
    });

    expect(cancelButton).toHaveFocus();

    try {
      await user.keyboard("{Shift>}{Tab}{/Shift}");
    } catch (error) {
      throw new Error(
        `Failed to test Shift+Tab focus behavior: ${error.message}`,
        { cause: error }
      );
    }

    expect(confirmDeleteButton).toHaveFocus();
  });
});