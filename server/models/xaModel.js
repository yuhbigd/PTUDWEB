const mongoose = require("mongoose");
const xaSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Hãy nhập mã huyện"],
    unique: [true, "mã huyện đã được cấp"],
    validate: {
      validator: function (v) {
        return /^([0-9][0-9][0-9][0-9][0-9][0-9])$/.test(v);
      },
      message: "Mã xã,phường không hợp lệ",
    },
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của xã,phường"],
  },
  huyen: {
    type: String,
    required: [true, "Hãy nhập mã của huyện,quận"],
  },
  count: { type: Number, default: 0 },
});
const Xa = mongoose.model("xas", xaSchema);

module.exports = Xa;
