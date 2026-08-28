import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider} from "./AuthContext";
import { useAuth } from "./useAuth";
import {
  verifySession,
  logoutUser,
} from "../services/authService";

jest.mock("../services/authService");

function TestComponent() {
  const { user, loading, logout } = useAuth();

  return (
    <div>
      <p>{loading ? "Loading..." : "Ready"}</p>

      {user ? (
        <>
          <p>Logged in as {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("restores the user when a valid session exists", async () => {
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

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText("Logged in as Test User")).toBeInTheDocument();

    expect(verifySession).toHaveBeenCalledTimes(1);
  });

  test("clears the user when the session is invalid or expired", async () => {
    verifySession.mockRejectedValue({
      response: {
        status: 401,
        data: {
          message: "Session expired",
        },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText("Not logged in")).toBeInTheDocument();

    expect(verifySession).toHaveBeenCalledTimes(1);
  });

  test("logs out the authenticated user", async () => {
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

    logoutUser.mockResolvedValue({
      success: true,
      message: "Logout successful",
    });

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      await screen.findByText("Logged in as Test User")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Not logged in")).toBeInTheDocument();
  });
});