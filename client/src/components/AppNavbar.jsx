import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AppNavbar = () => {
  const navigate = useNavigate();
  useLocation(); // re-render the navbar whenever the page changes
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const homeLink = !user ? "/" : user.type === "admin" ? "/adminhome" : "/userhome";

  return (
    <Navbar
      expand="lg"
      variant={user ? "dark" : "light"}
      className={user ? "navbar-gradient shadow-sm" : "bg-white shadow-sm"}
    >
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to={homeLink} className="fs-3">
          HotelPro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center">
            {/* Visitor (not logged in) */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">SignUp</Nav.Link>
              </>
            )}

            {/* Logged in (user or admin) */}
            {user && (
              <Navbar.Text className="me-3 text-white fw-semibold">
                Hi, {user.name}
              </Navbar.Text>
            )}

            {/* Ordinary user links */}
            {user && user.type === "ordinary" && (
              <>
                <Nav.Link as={Link} to="/userhome">Rooms</Nav.Link>
                <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>
              </>
            )}

            {user && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;