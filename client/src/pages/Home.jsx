import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import API from "../api/axios";
import RoomCard from "../components/RoomCard";

const slides = [
  {
    img: "https://picsum.photos/id/164/1600/600",
    title: "Welcome to HotelPro",
    text: "Comfortable rooms and easy online booking.",
  },
  {
    img: "https://picsum.photos/id/1040/1600/600",
    title: "Delux Rooms",
    text: "Luxury stays with beautiful views.",
  },
  {
    img: "https://picsum.photos/id/1048/1600/600",
    title: "Book in Minutes",
    text: "Pick your dates, choose a room, and you're done.",
  },
];

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Load a preview of rooms (public API, no login needed)
  useEffect(() => {
    API.get("/rooms")
      .then((res) => setRooms(res.data.rooms.slice(0, 3)))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  // Where the "Book Now" buttons should go
  const bookLink = !user ? "/login" : user.type === "admin" ? "/adminhome" : "/userhome";

  return (
    <>
      {/* Hero carousel */}
      <Carousel fade interval={4000}>
        {slides.map((slide) => (
          <Carousel.Item key={slide.title}>
            <img className="d-block w-100 carousel-img" src={slide.img} alt={slide.title} />
            <Carousel.Caption className="carousel-caption-box">
              <h1 className="fw-bold">{slide.title}</h1>
              <p className="fs-5">{slide.text}</p>
              <Button as={Link} to={bookLink} size="lg">
                Book Now
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* About section */}
      <Container className="py-5" id="about">
        <Row className="align-items-center g-5">
          <Col md={6}>
            <h2 className="fw-bold mb-3">About HotelPro</h2>
            <p className="text-muted">
              HotelPro is a hotel management system that makes booking simple for guests
              and managing rooms easy for hotel staff. Browse our rooms, choose your dates,
              and confirm your stay in a few clicks.
            </p>
            <ul className="list-unstyled text-muted">
              <li className="mb-2"><i className="fas fa-check text-primary me-2"></i>Secure login and booking</li>
              <li className="mb-2"><i className="fas fa-check text-primary me-2"></i>Delux and standard rooms</li>
              <li className="mb-2"><i className="fas fa-check text-primary me-2"></i>Easy cancellation from your booking history</li>
            </ul>
          </Col>
          <Col md={6}>
            <img
              src="https://picsum.photos/id/1029/700/450"
              alt="About HotelPro"
              className="img-fluid rounded-4 shadow"
            />
          </Col>
        </Row>
      </Container>

      {/* Rooms preview */}
      <Container className="pb-5">
        <h2 className="fw-bold text-center mb-4">Our Rooms</h2>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : rooms.length === 0 ? (
          <p className="text-center text-muted">No rooms available yet.</p>
        ) : (
          <Row className="g-4">
            {rooms.map((room) => (
              <Col md={6} lg={4} key={room._id}>
                <RoomCard room={room}>
                  <Button as={Link} to={bookLink} className="w-100">
                    Book Now
                  </Button>
                </RoomCard>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Home;