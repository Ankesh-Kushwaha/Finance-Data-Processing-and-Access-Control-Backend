import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ["income", "expense"],
  },
  category: String,
  date: { type: Date, default: Date.now },
  note: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Record = mongoose.model("Record", recordSchema);
export default Record;