import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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

test("logs in successfully and stores the JWT", async () => {
  loginUser.mockResolvedValue({
    success: true,
    message: "Login successful",
    data: {
      token: "fake-jwt-token",
    },
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: /login/i })
  );

  await waitFor(() => {
    expect(loginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  expect(localStorage.getItem("token")).toBe("fake-jwt-token");
});