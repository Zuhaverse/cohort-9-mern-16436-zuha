import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { loginUser } from "../services/authService";

jest.mock("../services/authService");

test("renders the login page", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: /welcome to notespace/i  })
  ).toBeInTheDocument();

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /login/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: /sign up/i })
  ).toBeInTheDocument();
});

test("logs in successfully and redirects to dashboard", async () => {
  loginUser.mockResolvedValue({
    success: true,
    message: "Login successful",
    data: {},
  });

  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<h1>Dashboard</h1>}
        />
      </Routes>
    </MemoryRouter>
  );

  try {
    await user.type(
      screen.getByLabelText(/email/i),
      "test@example.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "password123"
    );

    await user.click(
      screen.getByRole("button", { name: /login/i })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(
      await screen.findByRole("heading", { name: "Dashboard" })
    ).toBeInTheDocument();
  } catch (error) {
    throw new Error(
      `Login flow test failed: ${error.message}`,
      { cause: error }
    );
  }
});