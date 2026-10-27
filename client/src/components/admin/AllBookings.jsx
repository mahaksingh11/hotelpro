import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../api/axios";
import BookingCard from "../BookingCard";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    API.get("/bookings")
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => toast.error(err.response?.data?.message || "Could not load bookings"))
      .finally(() => setLoading(false));
  }, []);

  // Admin can cancel any booking (moderation)
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      setCancellingId(bookingId);
      await API.post("/bookings/cancelbooking", { bookingId });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;

  const activeCount = bookings.filter((b) => b.status === "booked").length;

  return (
    <>
      <h3 className="text-center mb-2">All Bookings</h3>
      <p className="text-center text-muted mb-4">
        Active: <strong>{activeCount}</strong> · Cancelled:{" "}
        <strong>{bookings.length - activeCount}</strong>
      </p>

      {bookings.length === 0 ? (
        <Alert variant="info" className="text-center">No bookings yet.</Alert>
      ) : (
        <>
          <Row className="g-4">
            {bookings.map((booking) => (
              <Col md={6} key={booking._id}>
                <BookingCard
                  booking={booking}
                  showCustomer
                  onCancel={handleCancel}
                  cancelling={cancellingId === booking._id}
                />
              </Col>
            ))}
          </Row>
          <p className="text-center fw-bold mt-4">Total Bookings: {bookings.length}</p>
        </>
      )}
    </>
  );
};

export default AllBookings;