import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useNavigate } from "react-router-dom";
import GetTicket from "../components/GetTicket";  
import API from "../API";            

jest.mock("../API");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("GetTicket Component", () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (API.getAllServices as jest.Mock).mockReset();
    (API.addTicket as jest.Mock).mockReset();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("displays a loading message initially", () => {
    (API.getAllServices as jest.Mock).mockReturnValue(new Promise(() => {})); 

    render(
      <MemoryRouter>
        <GetTicket />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading services...")).toBeInTheDocument();
  });

  it("displays an error message if the services fail to load", async () => {
    (API.getAllServices as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <MemoryRouter>
        <GetTicket />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load services")).toBeInTheDocument();
    });
  });

  it("displays the list of services once loaded", async () => {
    const mockServices = [
      { id: 1, name: "Service 1", description: "Service 1 description", serviceTime: 30, tag: "service1" },
      { id: 2, name: "Service 2", description: "Service 2 description", serviceTime: 20, tag: "service2" },
    ];

    (API.getAllServices as jest.Mock).mockResolvedValueOnce(mockServices);

    render(
      <MemoryRouter>
        <GetTicket />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Service 1")).toBeInTheDocument());
    expect(screen.getByText("Service 2")).toBeInTheDocument();
  });

  it("redirects to the ticket page when a service is selected successfully", async () => {
    const mockServices = [
      { id: 1, name: "Service 1", description: "Service 1 description", serviceTime: 30, tag: "service1" },
    ];

    (API.getAllServices as jest.Mock).mockResolvedValueOnce(mockServices);
    (API.addTicket as jest.Mock).mockResolvedValueOnce({ waitlistCode: "123ABC" });

    render(
      <MemoryRouter>
        <GetTicket />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Service 1")).toBeInTheDocument());

    const serviceButton = screen.getByRole("button", { name: /service 1/i });
    fireEvent.click(serviceButton);

    await waitFor(() => {
      expect(API.addTicket).toHaveBeenCalledWith("Service 1");
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/ticket/service1/123ABC");
    });
  });

  it("displays an error message if adding a ticket fails", async () => {
    const mockServices = [
      { id: 1, name: "Service 1", description: "Service 1 description", serviceTime: 30, tag: "service1" },
    ];

    (API.getAllServices as jest.Mock).mockResolvedValueOnce(mockServices);
    (API.addTicket as jest.Mock).mockRejectedValueOnce(new Error("Failed to add ticket"));

    render(
      <MemoryRouter>
        <GetTicket />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Service 1")).toBeInTheDocument());

    const serviceButton = screen.getByRole("button", { name: /service 1/i });
    fireEvent.click(serviceButton);

    await waitFor(() => {
      expect(API.addTicket).toHaveBeenCalledWith("Service 1");
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to add ticket")).toBeInTheDocument();
    });
  });

  it("displays a message if no services are available", async () => {
    (API.getAllServices as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <GetTicket />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No services available")).toBeInTheDocument();
    });
  });
});
