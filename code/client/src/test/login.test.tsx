import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Login from "../components/Login";
import API from "../app/services/API";
jest.mock("../app/services/API");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (API.login as jest.Mock).mockReset();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("displays an error message when submitting with empty fields", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText("Please enter your username.")).toBeInTheDocument();
  });

  it("displays an error message when password is missing", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Enter username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText("Please enter your password.")).toBeInTheDocument();
  });

  it("redirects to /officer on successful login", async () => {
    (API.login as jest.Mock).mockImplementation((username, password) => {
      if (username === "john" && password === "pwd") {
        return Promise.resolve({});
      } else {
        return Promise.reject({
          response: { data: { message: "Invalid credentials" } },
        });
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, { target: { value: "john" } });
    fireEvent.change(passwordInput, { target: { value: "pwd" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(API.login).toHaveBeenCalledWith("john", "pwd");
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/officer");
    });
  });

  it("displays an error message on API error", async () => {
    (API.login as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, { target: { value: "correctUsername" } });
    fireEvent.change(passwordInput, { target: { value: "correctPassword" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(API.login).toHaveBeenCalledWith(
        "correctUsername",
        "correctPassword"
      );
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
