const mongoose = require("mongoose");
const tinhSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Hãy nhập mã tỉnh"],
    unique: [true, "mã tỉnh đã được cấp"],
    index: true,
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của tỉnh"],
    index: true,
  },
  count: { type: Number, default: 0 },
});
const Tinh = mongoose.model("tinhs", tinhSchema);

module.exports = Tinh;
