import { Container } from "react-bootstrap";
import GetRooms from "../components/GetRooms";

const UserHome = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <>
      <div className="user-hero text-white py-5 mb-4">
        <Container>
          <h1 className="fw-bold">Welcome, {user?.name}!</h1>
          <p className="fs-5 mb-0">Choose your dates below to find and book a room.</p>
        </Container>
      </div>

      <Container className="pb-5">
        <GetRooms />
      </Container>
    </>
  );
};

export default UserHome;