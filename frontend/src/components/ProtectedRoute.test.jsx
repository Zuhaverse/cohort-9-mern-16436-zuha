import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { verifySession } from "../services/authService";

jest.mock("../services/authService", () => ({
  verifySession: jest.fn(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects unauthenticated users to login", async () => {
    verifySession.mockRejectedValue(new Error("Unauthorized"));

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Dashboard</h1>
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /login page/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /dashboard/i })
    ).not.toBeInTheDocument();
  });

  test("renders protected content when session is authenticated", async () => {
    verifySession.mockResolvedValue({
      success: true,
      authenticated: true,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Dashboard</h1>
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
  });
});