import { Card, Badge, Button } from "react-bootstrap";
import { formatDate } from "../utils/dates";

const BookingCard = ({ booking, onCancel, cancelling, showCustomer = false }) => {
  const isBooked = booking.status === "booked";

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center gap-2 mb-3">
          <h5 className="mb-0">{booking.roomType} Room</h5>
          <Badge bg={isBooked ? "success" : "danger"} className="text-uppercase">
            {booking.status}
          </Badge>
        </div>

        <p className="mb-1"><strong>Booking ID:</strong> {booking._id}</p>
        <p className="mb-1"><strong>Room Number:</strong> {booking.roomNumber}</p>
        <p className="mb-1">
          <strong>From:</strong> {formatDate(booking.fromDate)}
          <span className="text-danger mx-2">|</span>
          <strong>To:</strong> {formatDate(booking.toDate)}
        </p>
        <p className="mb-1"><strong>Total Days:</strong> {booking.totalDays}</p>
        <p className="mb-1"><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
        {showCustomer && (
          <p className="mb-1"><strong>Customer:</strong> {booking.userName}</p>
        )}
        <p className="mb-1"><strong>Customer Phone:</strong> {booking.phone}</p>
        <p className="mb-3 text-muted">
          Paid with card ending {booking.cardDetails?.cardLast4}
        </p>

        {/* Cancel button only for active bookings, and only where cancelling is allowed */}
        {onCancel && isBooked && (
          <Button
            variant="outline-danger"
            className="w-100 rounded-pill"
            disabled={cancelling}
            onClick={() => onCancel(booking._id)}
          >
            {cancelling ? "Cancelling..." : "CANCEL BOOKING"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookingCard;