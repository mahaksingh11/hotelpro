const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");

const ONE_DAY = 1000 * 60 * 60 * 24;

// Two date ranges overlap if each starts on/before the other ends
const isOverlapping = (aFrom, aTo, bFrom, bTo) =>
  new Date(aFrom) <= new Date(bTo) && new Date(aTo) >= new Date(bFrom);

// POST /api/bookings/bookroom  (logged-in user)
const bookRoom = async (req, res) => {
  try {
    const { roomId, fromDate, toDate, cardDetails } = req.body;

    if (!roomId || !fromDate || !toDate || !cardDetails) {
      return res.status(400).json({ success: false, message: "Room, dates and card details are required" });
    }

    // 1. Validate dates
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (from < today) {
      return res.status(400).json({ success: false, message: "From date cannot be in the past" });
    }
    if (to < from) {
      return res.status(400).json({ success: false, message: "To date must be on or after the from date" });
    }

    // 2. Validate card details (demo payment - nothing is charged)
    const { cardHolderName, cardNumber, cvv, expMonthYear } = cardDetails;
    const cleanCardNumber = String(cardNumber || "").replace(/\s/g, "");

    if (!cardHolderName || !cardHolderName.trim()) {
      return res.status(400).json({ success: false, message: "Cardholder name is required" });
    }
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      return res.status(400).json({ success: false, message: "Card number must be 16 digits" });
    }
    if (!/^\d{3}$/.test(String(cvv || ""))) {
      return res.status(400).json({ success: false, message: "CVV must be 3 digits" });
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(String(expMonthYear || ""))) {
      return res.status(400).json({ success: false, message: "Expiry must be in MM/YY format" });
    }
    const [mm, yy] = expMonthYear.split("/").map(Number);
    const cardValidUntil = new Date(Date.UTC(2000 + yy, mm, 1)); // first day after expiry month
    if (cardValidUntil <= new Date()) {
      return res.status(400).json({ success: false, message: "Card has expired" });
    }

    // 3. Check the room exists and is free for these dates
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    const alreadyBooked = room.currentBookings.some(
      (b) => b.status === "booked" && isOverlapping(b.fromDate, b.toDate, from, to)
    );
    if (alreadyBooked) {
      return res.status(400).json({ success: false, message: "Room is already booked for these dates" });
    }

    // 4. Get the user's name and phone from their account
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 5. Calculate price (both start and end day are counted)
    const totalDays = Math.round((to - from) / ONE_DAY) + 1;
    const totalAmount = totalDays * room.rentPerDay;

    // 6. Save booking - only safe card info is stored (never full number or CVV)
    const booking = await Booking.create({
      roomId: room._id,
      roomNumber: room.roomNumber,
      roomType: room.type,
      userId: user._id,
      userName: user.name,
      phone: user.phone,
      fromDate: from,
      toDate: to,
      totalDays,
      totalAmount,
      cardDetails: {
        cardHolderName: cardHolderName.trim(),
        cardLast4: cleanCardNumber.slice(-4),
      },
      status: "booked",
    });

    // 7. Block these dates on the room
    room.currentBookings.push({
      bookingId: booking._id,
      userId: user._id,
      fromDate: from,
      toDate: to,
      status: "booked",
    });
    await room.save();

    res.status(201).json({ success: true, message: "Room booked successfully", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/bookings/my  (logged-in user - only their own bookings)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/bookings  (admin only - every booking)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/bookings/cancelbooking  (owner of the booking, or admin)
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Users can only cancel their own bookings
    if (booking.userId.toString() !== req.user.id && req.user.type !== "admin") {
      return res.status(403).json({ success: false, message: "You can only cancel your own bookings" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Free the dates on the room
    await Room.updateOne(
      { _id: booking.roomId },
      { $pull: { currentBookings: { bookingId: booking._id } } }
    );

    res.status(200).json({ success: true, message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { bookRoom, getMyBookings, getAllBookings, cancelBooking };