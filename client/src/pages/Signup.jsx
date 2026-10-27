import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone, type } = form;

    // Frontend validation (backend validates again)
    if (!name || !email || !password || !confirmPassword || !phone || !type) {
      return toast.error("Please fill in all fields");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!/^\d{10}$/.test(phone)) {
      return toast.error("Enter a valid 10-digit mobile number");
    }

    try {
      setLoading(true);
      const res = await API.post("/users/signup", form);
      toast.success(res.data.message); // "Account created successfully"
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center g-5">
        <Col md={6} className="d-none d-md-block">
          <img
            src="https://picsum.photos/id/164/700/520"
            alt="Hotel room"
            className="img-fluid auth-image shadow"
          />
        </Col>

        <Col md={6} lg={5}>
          <h4 className="fw-bold mb-4">Register for the Account</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Control className="mb-3" name="name" placeholder="Full Name"
              value={form.name} onChange={handleChange} />
            <Form.Control className="mb-3" type="email" name="email" placeholder="Email Address"
              value={form.email} onChange={handleChange} />
            <Form.Control className="mb-3" type="password" name="password" placeholder="Password"
              value={form.password} onChange={handleChange} />
            <Form.Control className="mb-3" type="password" name="confirmPassword" placeholder="Confirm Password"
              value={form.confirmPassword} onChange={handleChange} />
            <Form.Control className="mb-3" name="phone" placeholder="Enter Mobile no."
              value={form.phone} onChange={handleChange} />
            <Form.Select className="mb-4" name="type" value={form.type} onChange={handleChange}>
              <option value="">Select User</option>
              <option value="ordinary">Ordinary</option>
              <option value="admin">Admin</option>
            </Form.Select>

            <Button type="submit" className="px-5" disabled={loading}>
              {loading ? "Registering..." : "REGISTER"}
            </Button>
          </Form>
          <p className="mt-3 fw-semibold">
            Had an account? <Link to="/login" className="text-danger">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;