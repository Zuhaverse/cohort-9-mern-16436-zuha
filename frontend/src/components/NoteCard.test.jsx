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
  
    try {
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
    } catch (error) {
      throw new Error(
        `Note deletion flow test failed: ${error.message}`,
        { cause: error }
      );
    }
  });

  test("keeps focus inside the confirmation dialog when Shift+Tab is pressed from the dialog root", async () => {
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
  
    const dialog = screen.getByRole("dialog");
  
    const confirmDeleteButton = screen.getByRole("button", {
      name: "Delete",
    });
  
    expect(dialog).toHaveFocus();
  
    await user.keyboard("{Shift>}{Tab}{/Shift}");
  
    expect(confirmDeleteButton).toHaveFocus();
  });
});