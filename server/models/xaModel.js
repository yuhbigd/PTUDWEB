const mongoose = require("mongoose");
const Huyen = require("./huyenModel");
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
    index: true,
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của xã,phường"],
    index: true,
  },
  huyen: {
    type: String,
    required: [true, "Hãy nhập mã của huyện,quận"],
  },
  count: { type: Number, default: 0 },
});
xaSchema.pre("save", async function (next) {
  const huyen = await Huyen.findOne({
    id: this.huyen,
  });
  await Huyen.findOneAndUpdate(
    {
      id: this.huyen,
    },
    {
      $set: {
        count: huyen.count + 1,
      },
    },
  );
});
const Xa = mongoose.model("xas", xaSchema);

module.exports = Xa;
