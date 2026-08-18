import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("redirects unauthenticated users to login", () => {
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

    expect(screen.getByRole("heading", { name: /login page/i }))
      .toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /dashboard/i })
    ).not.toBeInTheDocument();
  });

  test("renders protected content when token exists", () => {
    localStorage.setItem("token", "fake-jwt-token");

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
      screen.getByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
  });
});