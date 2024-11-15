import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GetTicket.css";
import API from "../API";
import { Col, Container, Row } from "react-bootstrap";
interface Service {
  id: number;
  tag: string;
  name: string;
  description: string;
  serviceTime: number;
}

export default function GetTicket() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await API.getAllServices();
        if (Array.isArray(response)) {
          setServices(response);
        } else {
          setError("Unexpected response format");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSelectService = async (service: Service) => {
    try {
      const response = await API.addTicket(service.name);

      const waitlistCode = response.waitlistCode;

      navigate(`/ticket/${service.tag}/${waitlistCode}`);
    } catch (err) {
      console.error("Failed to add ticket:", err);
      setError("Failed to add ticket");
    }
  };

  if (loading) {
    return <div className="centered-container">Loading services...</div>;
  }

  if (error) {
    return <div className="centered-container text-danger">{error}</div>;
  }

  const imagePath = (tag: string) => {
    if (tag === "TP01") {
      return "./src/assets/tax.jpg";
    } else if (tag === "PD02") {
      return "./src/assets/delivery.jpg";
    } else if (tag === "GA03") {
      return "./src/assets/assistant.jpg";
    }
  };

  return (
    <Container className="centered-container sm-5">
      <div className="border rounded col-md-8 custom-class">
        <h1 className="text-center">Choose your Service</h1>
        <Row>
          {Array.isArray(services) && services.length > 0 ? (
            services.map((service) => (
              <Col md={6} className="my-2">
                <button
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className="btn btn-primary my-2 h-100 d-grid align-items-center"
                  style={{ width: "100%", maxWidth: "300px" }}
                >
                  <img
                    src={imagePath(service.tag)}
                    style={{ width: "100%", mixBlendMode: "color-dodge" }}
                  ></img>
                  <div>{service.name}</div>
                </button>
              </Col>
            ))
          ) : (
            <div>No services available</div>
          )}
        </Row>
      </div>
    </Container>
  );
}
