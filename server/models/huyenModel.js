const mongoose = require("mongoose");
const Tinh = require("./tinhModel");
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
    index: true,
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của huyện,quận"],
    index: true,
  },
  tinh: {
    type: String,
    required: [true, "Hãy nhập mã của tỉnh"],
  },
  count: { type: Number, default: 0 },
});
huyenSchema.pre("save", async function (next) {
  const tinh = await Tinh.findOne({
    id: this.tinh,
  });
  await Tinh.findOneAndUpdate(
    {
      id: this.tinh,
    },
    {
      $set: {
        count: tinh.count + 1,
      },
    },
  );
});
const Huyen = mongoose.model("huyens", huyenSchema);

module.exports = Huyen;
