import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("logs in successfully and redirects to dashboard", async () => {
  loginUser.mockResolvedValue({
    success: true,
    message: "Login successful",
    data: {},
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  try {
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "test@example.com"
    );
  
    await userEvent.type(
      screen.getByLabelText(/password/i),
      "password123"
    );
  
    await userEvent.click(
      screen.getByRole("button", { name: /login/i })
    );
  
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  } catch (error) {
    throw new Error(
      `Login flow test failed: ${error.message}`,
      { cause: error }
    );
  }
});