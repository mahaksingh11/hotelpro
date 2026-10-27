import { Card } from "react-bootstrap";

const FALLBACK_IMAGE = "https://picsum.photos/id/1048/600/400";

// Reusable room card. Anything placed between <RoomCard>...</RoomCard>
// (like a button) appears at the bottom of the card.
const RoomCard = ({ room, children }) => (
  <Card className="h-100 shadow-sm border-0 room-card">
    <Card.Img
      variant="top"
      src={room.imageUrls?.[0] || FALLBACK_IMAGE}
      alt={`Room ${room.roomNumber}`}
      className="room-card-img"
    />
    <Card.Body className="d-flex flex-column">
      <Card.Title>
        Room {room.roomNumber} · {room.type}
      </Card.Title>
      <Card.Text className="text-muted mb-1">
        <i className="fas fa-user-friends me-2"></i>
        Capacity: {room.maxCount} People
      </Card.Text>
      <Card.Text className="text-muted mb-2">
        <i className="fas fa-rupee-sign me-2"></i>
        Rent: ₹{room.rentPerDay} per day
      </Card.Text>
      <Card.Text className="mb-3">{room.description}</Card.Text>
      <div className="mt-auto">{children}</div>
    </Card.Body>
  </Card>
);

export default RoomCard;