import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

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