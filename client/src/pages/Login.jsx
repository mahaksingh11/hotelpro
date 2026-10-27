import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please enter email and password");
    }

    try {
      setLoading(true);
      const res = await API.post("/users/login", form);

      // Save token and user so the app remembers who is logged in
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Welcome, ${res.data.user.name}!`);

      // Send each role to its own dashboard
      navigate(res.data.user.type === "admin" ? "/adminhome" : "/userhome");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center g-5">
        <Col md={6} className="d-none d-md-block">
          <img
            src="https://picsum.photos/id/1040/700/520"
            alt="Hotel"
            className="img-fluid auth-image shadow"
          />
        </Col>

        <Col md={6} lg={5}>
          <h4 className="fw-bold mb-4">Login for the Account</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Control className="mb-3" type="email" name="email" placeholder="Email address"
              value={form.email} onChange={handleChange} />
            <Form.Control className="mb-4" type="password" name="password" placeholder="Password"
              value={form.password} onChange={handleChange} />
            <Button type="submit" className="px-5" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </Button>
          </Form>
          <p className="mt-3 fw-semibold">
            Don't have an account? <Link to="/signup" className="text-danger">Register</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;