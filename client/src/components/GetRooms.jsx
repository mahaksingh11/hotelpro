import { useState } from "react";
import { Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios";
import RoomCard from "./RoomCard";
import BookingModal from "./BookingModal";
import { todayString, formatDate } from "../utils/dates";

const GetRooms = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchedDates, setSearchedDates] = useState(null); // dates the results belong to
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const searchRooms = async (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      return toast.error("Please select both arrival and departure dates");
    }
    if (toDate < fromDate) {
      return toast.error("Departure date must be on or after arrival date");
    }

    try {
      setLoading(true);
      const res = await API.get("/rooms/available", { params: { fromDate, toDate } });
      setRooms(res.data.rooms);
      setSearchedDates({ from: fromDate, to: toDate });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load rooms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Date selection */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={searchRooms}>
            <Row className="g-3 align-items-end">
              <Col md={4}>
                <Form.Label className="fw-semibold">Arrival date</Form.Label>
                <Form.Control
                  type="date"
                  min={todayString()}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label className="fw-semibold">Departure date</Form.Label>
                <Form.Control
                  type="date"
                  min={fromDate || todayString()}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? "Searching..." : "Check Availability"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results */}
      {!searchedDates ? (
        <Alert variant="info">
          Select your arrival and departure dates to see available rooms.
        </Alert>
      ) : rooms.length === 0 ? (
        <Alert variant="warning">
          No rooms are available for these dates. Please try different dates.
        </Alert>
      ) : (
        <>
          <p className="text-muted">
            {rooms.length} room(s) available from {formatDate(searchedDates.from)} to{" "}
            {formatDate(searchedDates.to)}
          </p>
          <Row className="g-4">
            {rooms.map((room) => (
              <Col md={6} lg={4} key={room._id}>
                <RoomCard room={room}>
                  <Button className="w-100" onClick={() => setSelectedRoom(room)}>
                    Book Now
                  </Button>
                </RoomCard>
              </Col>
            ))}
          </Row>
        </>
      )}

      <BookingModal
        show={!!selectedRoom}
        room={selectedRoom}
        fromDate={searchedDates?.from}
        toDate={searchedDates?.to}
        onHide={() => setSelectedRoom(null)}
      />
    </>
  );
};

export default GetRooms;