const Room = require("../models/roomModel");

// POST /api/rooms/addroom  (admin only)
const addRoom = async (req, res) => {
  try {
    const { roomNumber, maxCount, rentPerDay, imageUrls, type, description } = req.body;

    if (!roomNumber || !maxCount || !rentPerDay || !type || !description) {
      return res.status(400).json({ success: false, message: "All room fields are required" });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: "Room number already exists" });
    }

    // Remove empty image fields (admin may fill only 1 or 2 of the 3)
    const cleanImages = (imageUrls || []).filter((url) => url && url.trim() !== "");

    const newRoom = new Room({
      roomNumber,
      maxCount,
      rentPerDay,
      imageUrls: cleanImages,
      type,
      description,
    });

    const room = await newRoom.save(); // created using .save() as the task requires
    res.status(201).json({ success: true, message: "Room added successfully", room });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/rooms  (public - used on Home page and UserHome)
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/rooms/:id  (public - single room details)
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, room });
  } catch (error) {
    // Invalid ID format also lands here
    res.status(404).json({ success: false, message: "Room not found" });
  }
};

module.exports = { addRoom, getAllRooms, getRoomById };