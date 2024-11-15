import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/TicketPage.css";

export default function TicketPage() {
  const { serviceTag, waitlistCode } = useParams();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate("/");
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  const handlePrintTicket = () => {
    window.print();
    navigate("/");
  };

  if (!serviceTag || !waitlistCode) {
    return <p>No ticket data available.</p>;
  }

  return (
    <div className="centered-container d-flex flex-column justify-content-center align-items-center">
      <div
        className="printable-ticket alert alert-success mt-4 text-center"
        role="alert"
      >
        <h4 className="alert-heading">Your ticket:</h4>
        <p>
          Number: <strong>{waitlistCode}</strong>
        </p>
        <p>
          Service: <strong>{serviceTag}</strong>
        </p>
      </div>

      <p className="timer-text mt-3">
        Redirecting to home page in <strong>{secondsLeft}</strong> seconds
      </p>

      <button className="btn btn-primary mt-4" onClick={handlePrintTicket}>
        Save your ticket as PDF
      </button>
    </div>
  );
}
