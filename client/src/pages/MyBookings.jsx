import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios";
import BookingCard from "../components/BookingCard";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Load this user's bookings
  useEffect(() => {
    API.get("/bookings/my")
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => toast.error(err.response?.data?.message || "Could not load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setCancellingId(bookingId);
      await API.post("/bookings/cancelbooking", { bookingId });
      // Update the card on screen without reloading
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">My Bookings</h2>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : bookings.length === 0 ? (
        <Alert variant="info" className="text-center">
          You have no bookings yet. Go to Rooms to book your first stay.
        </Alert>
      ) : (
        <>
          <Row className="g-4">
            {bookings.map((booking) => (
              <Col md={6} key={booking._id}>
                <BookingCard
                  booking={booking}
                  onCancel={handleCancel}
                  cancelling={cancellingId === booking._id}
                />
              </Col>
            ))}
          </Row>
          <p className="text-center fw-bold mt-4">Total Bookings: {bookings.length}</p>
        </>
      )}
    </Container>
  );
};

export default MyBookings;