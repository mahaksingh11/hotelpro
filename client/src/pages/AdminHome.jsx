import { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import AllBookings from "../components/admin/AllBookings";
import AllRooms from "../components/admin/AllRooms";
import AddRoom from "../components/admin/AddRoom";
import AllUsers from "../components/admin/AllUsers";

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <Container className="py-4">
      <div className="bg-white rounded shadow-sm p-3 p-md-4">
        {/* mountOnEnter + unmountOnExit = each tab reloads fresh data when opened */}
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-4 admin-tabs"
          mountOnEnter
          unmountOnExit
        >
          <Tab eventKey="bookings" title="ALL BOOKINGS">
            <AllBookings />
          </Tab>
          <Tab eventKey="rooms" title="ALL ROOMS">
            <AllRooms />
          </Tab>
          <Tab eventKey="addroom" title="ADD ROOM">
            <AddRoom onAdded={() => setActiveTab("rooms")} />
          </Tab>
          <Tab eventKey="users" title="ALL USERS">
            <AllUsers />
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default AdminHome;