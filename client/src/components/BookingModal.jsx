import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios";
import { formatDate, countDays } from "../utils/dates";

const emptyCard = { cardHolderName: "", cardNumber: "", expMonthYear: "", cvv: "" };

const BookingModal = ({ show, onHide, room, fromDate, toDate }) => {
  const navigate = useNavigate();
  const [card, setCard] = useState(emptyCard);
  const [loading, setLoading] = useState(false);

  if (!room) return null;

  const totalDays = countDays(fromDate, toDate);
  const totalAmount = totalDays * room.rentPerDay;

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setCard(emptyCard);
    onHide();
  };

  const handleBook = async (e) => {
    e.preventDefault();
    const cleanNumber = card.cardNumber.replace(/\s/g, "");

    // Frontend card validation (backend checks again)
    if (!card.cardHolderName.trim()) return toast.error("Enter the cardholder name");
    if (!/^\d{16}$/.test(cleanNumber)) return toast.error("Card number must be 16 digits");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expMonthYear))
      return toast.error("Expiry must be in MM/YY format");
    if (!/^\d{3}$/.test(card.cvv)) return toast.error("CVV must be 3 digits");

    try {
      setLoading(true);
      await API.post("/bookings/bookroom", {
        roomId: room._id,
        fromDate,
        toDate,
        cardDetails: card,
      });
      toast.success("Room booked successfully!");
      handleClose();
      navigate("/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Room {room.roomNumber}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Booking summary */}
        <div className="bg-light rounded p-3 mb-3">
          <p className="mb-1"><strong>Room Type:</strong> {room.type}</p>
          <p className="mb-1">
            <strong>From:</strong> {formatDate(fromDate)}
            <span className="mx-2">→</span>
            <strong>To:</strong> {formatDate(toDate)}
          </p>
          <p className="mb-1">
            <strong>Total Days:</strong> {totalDays} × ₹{room.rentPerDay}
          </p>
          <p className="mb-0 fs-5"><strong>Total Amount: ₹{totalAmount}</strong></p>
        </div>

        <Alert variant="info" className="py-2 small">
          Demo payment: no real money is charged. You can use the test card
          4242 4242 4242 4242 with any future expiry and any 3-digit CVV.
        </Alert>

        {/* Card details form */}
        <Form onSubmit={handleBook}>
          <Form.Control className="mb-3" name="cardHolderName" placeholder="Cardholder Name"
            value={card.cardHolderName} onChange={handleChange} />
          <Form.Control className="mb-3" name="cardNumber" placeholder="Card Number (16 digits)"
            maxLength={19} value={card.cardNumber} onChange={handleChange} />
          <Row className="g-3 mb-4">
            <Col>
              <Form.Control name="expMonthYear" placeholder="Expiry (MM/YY)" maxLength={5}
                value={card.expMonthYear} onChange={handleChange} />
            </Col>
            <Col>
              <Form.Control type="password" name="cvv" placeholder="CVV" maxLength={3}
                value={card.cvv} onChange={handleChange} />
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={handleClose} className="w-50">
              Cancel
            </Button>
            <Button type="submit" className="w-50" disabled={loading}>
              {loading ? "Processing..." : `Pay ₹${totalAmount}`}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;