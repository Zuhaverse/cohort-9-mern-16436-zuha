import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { loginUser, verifySession } from "../services/authService";
import { AuthProvider } from "../context/AuthContext";

jest.mock("../services/authService");

test("renders the login page", () => {
  verifySession.mockResolvedValue({
    success: true,
    authenticated: true,
    data: {
      user: null,
    },
  });
  render(
    <MemoryRouter>
      <AuthProvider>
      <Login />
      </AuthProvider>
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
    data: {
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
    },
  });

  verifySession.mockResolvedValue({
    success: true,
    authenticated: true,
    data: {
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
    },
  });

  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<h1>Dashboard</h1>}
          />
        </Routes>
      </AuthProvider>
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
      expect(loginUser).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
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