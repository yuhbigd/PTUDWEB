const mongoose = require("mongoose");
const huyenSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Hãy nhập mã huyện"],
    unique: [true, "mã huyện đã được cấp"],
    validate: {
      validator: function (v) {
        return /^([0-9][0-9][0-9][0-9])$/.test(v);
      },
      message: "Mã huyện,quận không hợp lệ",
    },
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của huyện,quận"],
  },
  tinh: {
    type: String,
    required: [true, "Hãy nhập mã của tỉnh"],
  },
  count: { type: Number, default: 0 },
});
const Huyen = mongoose.model("huyens", huyenSchema);

module.exports = Huyen;
