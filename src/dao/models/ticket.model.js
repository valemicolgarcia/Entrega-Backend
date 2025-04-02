import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios", // Asegurate de que coincida con tu UserModel
    required: true,
  },
});

const TicketModel = mongoose.model("tickets", ticketSchema);
export default TicketModel;
