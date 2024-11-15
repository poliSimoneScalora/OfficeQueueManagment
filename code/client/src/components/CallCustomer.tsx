import { useEffect, useState } from "react";
import API from "../API"; 
import "../styles/CallCustomer.css";

interface Service {
  id: number;
  tag: string; 
  name: string; 
}

interface CalledTicket {
  ticketID: number;
  serviceID: number;
  waitlistCode: number;
  counterID: number | null;
}

export default function CallCustomer() {
  const [calledTickets, setCalledTickets] = useState<CalledTicket[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to compare arrays of objects
  const arraysEqual = (a: CalledTicket[], b: CalledTicket[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].ticketID !== b[i].ticketID ||
          a[i].serviceID !== b[i].serviceID ||
          a[i].waitlistCode !== b[i].waitlistCode ||
          a[i].counterID !== b[i].counterID) {
        return false;
      }
    }
    return true;
  };

  const fetchCalledTickets = async () => {
    try {
      const ticketsResponse = await API.getAllTickets();
      if (Array.isArray(ticketsResponse)) {
        // Update state only if the data has changed
        if (!arraysEqual(ticketsResponse, calledTickets)) {
          setCalledTickets(ticketsResponse);
        }
      } else {
        setError("Unexpected response format for tickets");
        return;
      }

      const servicesResponse = await API.getAllServices(); 
      if (Array.isArray(servicesResponse)) {
        setServices(servicesResponse);
      } else {
        setError("Unexpected response format for services");
      }
    } catch (err) {
      console.error("Failed to load tickets or services:", err);
      setError("Failed to load tickets or services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchCalledTickets();

    // Set up polling to refresh data every 5 seconds
    const intervalId = setInterval(() => {
      fetchCalledTickets();
    }, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="centered-container">Loading tickets...</div>;
  }

  if (error) {
    return <div className="centered-container text-danger">{error}</div>;
  }

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Ticket Number</th>
            <th>Counter</th>
          </tr>
        </thead>
        <tbody>
          {calledTickets.slice(0, 6).map((ticket, index) => {
            const service = services.find(s => s.id === ticket.serviceID);
            return (
              <tr key={index}>
                <td>{service ? service.tag : "Unknown Service"}</td>
                <td>{ticket.waitlistCode}</td>
                <td>{ticket.counterID ? ticket.counterID : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
