const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true },
    roomType: { type: String, required: true },   // e.g. "Delux" - shown as "Delux Room"

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    phone: { type: String, required: true },

    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    // Payment info - only safe details are stored (never full card number or CVV)
    cardDetails: {
      cardHolderName: { type: String, required: true },
      cardLast4: { type: String, required: true },
    },

    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);