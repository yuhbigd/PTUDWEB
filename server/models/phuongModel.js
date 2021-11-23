const mongoose = require("mongoose");
const phuongSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Hãy nhập mã phường"],
    unique: [true, "mã phường đã được cấp"],
    validate: {
      validator: function (v) {
        return /^([0-9][1-9][0-9][1-9][0-9][1-9][0-9][1-9])$/.test(v);
      },
      message: "Mã phường không hợp lệ",
    },
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của phường"],
  },
  xa: {
    type: String,
    required: [true, "Hãy nhập mã của xã"],
  },
});
const phuong = mongoose.model("phuongs", phuongSchema);

module.exports = phuong;
