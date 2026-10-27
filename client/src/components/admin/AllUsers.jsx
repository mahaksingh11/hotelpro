import { useEffect, useState } from "react";
import { Table, Badge, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../api/axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data.users))
      .catch((err) => toast.error(err.response?.data?.message || "Could not load users"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;

  return (
    <div className="shadow-sm rounded overflow-hidden">
      <div className="bg-dark text-white text-center py-3">
        <h4 className="mb-0">All Registered Users</h4>
        <small>Total Users: {users.length}</small>
      </div>

      <Table responsive hover className="mb-0 bg-white align-middle">
        <thead className="table-light">
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="fw-semibold small">{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <Badge pill bg={user.type === "admin" ? "success" : "primary"}>
                  {user.type === "admin" ? "Admin" : "Ordinary"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllUsers;