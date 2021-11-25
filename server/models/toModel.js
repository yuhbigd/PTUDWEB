const mongoose = require("mongoose");
const Xa = require("./xaModel");
const toSchema = new mongoose.Schema({
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
    index: true,
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của phường"],
    index: true,
  },
  xa: {
    type: String,
    required: [true, "Hãy nhập mã của xã"],
  },
});
toSchema.pre("save", async function (next) {
  const xa = await Xa.findOne({
    id: this.xa,
  });
  await Xa.findOneAndUpdate(
    {
      id: this.xa,
    },
    {
      $set: {
        count: xa.count + 1,
      },
    },
  );
});
const To = mongoose.model("tos", toSchema);

module.exports = To;
