const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    maxCount: { type: Number, required: true, min: 1 },      // capacity
    rentPerDay: { type: Number, required: true, min: 0 },
    imageUrls: { type: [String], default: [] },               // up to 3 photos
    type: { type: String, enum: ["Delux", "Non-Delux"], required: true },
    description: { type: String, required: true },

    // Active reservations - used to check availability by date
    currentBookings: [
      {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fromDate: { type: Date },
        toDate: { type: Date },
        status: { type: String, default: "booked" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);