import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CallCustomer from "../components/CallCustomer";  
import API from "../API";  

jest.mock("../API");

describe("CallCustomer Component", () => {
  const mockTickets = [
    { ticketID: 1, serviceID: 1, waitlistCode: 1001, counterID: 1 },
    { ticketID: 2, serviceID: 2, waitlistCode: 1002, counterID: null },
  ];

  const mockServices = [
    { id: 1, tag: "SRV1", name: "Service 1" },
    { id: 2, tag: "SRV2", name: "Service 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loading message initially", () => {
    (API.getAllTickets as jest.Mock).mockReturnValue(new Promise(() => {})); 
    (API.getAllServices as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<CallCustomer />);

    expect(screen.getByText("Loading tickets...")).toBeInTheDocument();
  });

  it("displays an error message if loading tickets fails", async () => {
    (API.getAllTickets as jest.Mock).mockRejectedValue(new Error("Failed to fetch tickets"));
    (API.getAllServices as jest.Mock).mockResolvedValue(mockServices);

    render(<CallCustomer />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load tickets or services")).toBeInTheDocument();
    });
  });

  it("displays an error message if loading services fails", async () => {
    (API.getAllTickets as jest.Mock).mockResolvedValue(mockTickets);
    (API.getAllServices as jest.Mock).mockRejectedValue(new Error("Failed to fetch services"));

    render(<CallCustomer />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load tickets or services")).toBeInTheDocument();
    });
  });

  it("displays the list of tickets and services correctly", async () => {
    (API.getAllTickets as jest.Mock).mockResolvedValue(mockTickets);
    (API.getAllServices as jest.Mock).mockResolvedValue(mockServices);

    render(<CallCustomer />);

    await waitFor(() => {
      expect(screen.getByText("SRV1")).toBeInTheDocument();  
      expect(screen.getByText("1001")).toBeInTheDocument();  
      expect(screen.getByText("1")).toBeInTheDocument();  

      expect(screen.getByText("SRV2")).toBeInTheDocument();
      expect(screen.getByText("1002")).toBeInTheDocument();
      expect(screen.getByText("—")).toBeInTheDocument();  
    });
  });

  it("updates the list of tickets periodically", async () => {
    jest.useFakeTimers();  
    (API.getAllTickets as jest.Mock).mockResolvedValue(mockTickets);
    (API.getAllServices as jest.Mock).mockResolvedValue(mockServices);

    render(<CallCustomer />);

    await waitFor(() => {
      expect(screen.getByText("SRV1")).toBeInTheDocument();
    });

    
    const updatedTickets = [
      { ticketID: 1, serviceID: 1, waitlistCode: 1001, counterID: 1 },
      { ticketID: 3, serviceID: 2, waitlistCode: 1003, counterID: 2 },
    ];
    (API.getAllTickets as jest.Mock).mockResolvedValue(updatedTickets);

    jest.advanceTimersByTime(5000);  

    await waitFor(() => {
      expect(screen.getByText("1003")).toBeInTheDocument();  
      expect(screen.getByText("2")).toBeInTheDocument();  
    });

    jest.useRealTimers();  
  });
});
