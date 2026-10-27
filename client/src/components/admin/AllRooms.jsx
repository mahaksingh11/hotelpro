import { useEffect, useState } from "react";
import { Table, Badge, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../api/axios";

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/rooms")
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => toast.error(err.response?.data?.message || "Could not load rooms"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;

  return (
    <div className="shadow-sm rounded overflow-hidden">
      <div className="bg-primary text-white text-center py-3">
        <h4 className="mb-0">Hotel Rooms</h4>
        <small>Total Rooms: {rooms.length}</small>
      </div>

      {rooms.length === 0 ? (
        <Alert variant="info" className="m-3 text-center">
          No rooms yet. Add one from the Add Room tab.
        </Alert>
      ) : (
        <Table responsive hover className="mb-0 bg-white align-middle">
          <thead className="table-light">
            <tr>
              <th>Room ID</th>
              <th>Room Number</th>
              <th>Capacity</th>
              <th>Rent / Day</th>
              <th>Type</th>
              <th>Active Bookings</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td className="fw-semibold small">{room._id}</td>
                <td>{room.roomNumber}</td>
                <td>{room.maxCount}</td>
                <td>₹ {room.rentPerDay}</td>
                <td>
                  <Badge pill bg={room.type === "Delux" ? "success" : "secondary"}>
                    {room.type}
                  </Badge>
                </td>
                <td>{room.currentBookings.filter((b) => b.status === "booked").length}</td>
                <td>{room.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AllRooms;