import { NavLink, Outlet } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useAuthContext } from "../contexts/AuthContext";
import { LogoutButton } from "./Login";

function TopBar() {
  const { loggedIn } = useAuthContext();

  return (
    <div>
      <Navbar
        expand="lg"
        style={{
          border: "0px",
          borderRadius: "12px",
          backgroundColor: "#0c6efd21",
        }}
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            Screen selection
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as="div">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  Customer
                </NavLink>
              </Nav.Link>
              <Nav.Link as="div">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  Counter Officer
                </NavLink>
              </Nav.Link>

              <Nav.Link as="div">
                <NavLink
                  to="/display"
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  Monitor in the waiting room
                </NavLink>
              </Nav.Link>
              <Nav.Link as="div">
                <NavLink
                  to="/officer"
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  Bypass login for officer (dev only)
                </NavLink>
              </Nav.Link>
              {loggedIn ? (
                <Nav.Link as="div">
                  <LogoutButton />
                </Nav.Link>
              ) : (
                <Nav.Link as="div">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "active nav-link" : "nav-link"
                    }
                  >
                    Login
                  </NavLink>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr />
      <Outlet />
    </div>
  );
}

export default TopBar;
