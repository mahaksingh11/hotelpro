import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../api/axios";

const emptyForm = {
  roomNumber: "",
  maxCount: "",
  rentPerDay: "",
  imageUrls: ["", "", ""],
  type: "",
  description: "",
};

const AddRoom = ({ onAdded }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const images = [...form.imageUrls];
    images[index] = value;
    setForm({ ...form, imageUrls: images });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { roomNumber, maxCount, rentPerDay, type, description } = form;

    if (!roomNumber || !maxCount || !rentPerDay || !type || !description) {
      return toast.error("Please fill in all room details");
    }
    if (!Number.isInteger(Number(maxCount)) || Number(maxCount) < 1) {
      return toast.error("Capacity must be a whole number of at least 1");
    }
    if (Number(rentPerDay) <= 0) {
      return toast.error("Rent must be greater than 0");
    }

    try {
      setLoading(true);
      await API.post("/rooms/addroom", {
        ...form,
        maxCount: Number(maxCount),
        rentPerDay: Number(rentPerDay),
      });
      toast.success("Room added successfully");
      setForm(emptyForm);
      if (onAdded) onAdded(); // switch to the All Rooms tab
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-sm rounded overflow-hidden">
      <div className="bg-primary text-white text-center py-3">
        <h4 className="mb-0">Add a New Room</h4>
      </div>

      <Form onSubmit={handleSubmit} className="p-4 bg-white">
        <Row className="g-3 mb-3">
          <Col md={4}>
            <Form.Label>Room Number</Form.Label>
            <Form.Control name="roomNumber" placeholder="Room Number"
              value={form.roomNumber} onChange={handleChange} />
          </Col>
          <Col md={4}>
            <Form.Label>Max. Capacity</Form.Label>
            <Form.Control type="number" min="1" name="maxCount" placeholder="No. of people"
              value={form.maxCount} onChange={handleChange} />
          </Col>
          <Col md={4}>
            <Form.Label>Room Rent</Form.Label>
            <Form.Control type="number" min="1" name="rentPerDay" placeholder="Rent per day"
              value={form.rentPerDay} onChange={handleChange} />
          </Col>
        </Row>

        <Form.Label>Room Photos</Form.Label>
        {form.imageUrls.map((url, index) => (
          <Form.Control
            key={index}
            className="mb-2"
            placeholder={`Image ${index + 1} URL`}
            value={url}
            onChange={(e) => handleImageChange(index, e.target.value)}
          />
        ))}

        <Form.Label className="mt-3 d-block">Room Type</Form.Label>
        <div className="mb-3">
          {["Delux", "Non-Delux"].map((option) => (
            <Form.Check
              key={option}
              inline
              type="radio"
              id={`type-${option}`}
              name="type"
              label={option}
              value={option}
              checked={form.type === option}
              onChange={handleChange}
            />
          ))}
        </div>

        <Form.Label>Room Description</Form.Label>
        <Form.Control as="textarea" rows={4} name="description" className="mb-4"
          value={form.description} onChange={handleChange} />

        <div className="text-center">
          <Button type="submit" className="px-5" disabled={loading}>
            {loading ? "Adding..." : "ADD ROOM"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddRoom;