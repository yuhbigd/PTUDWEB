const mongoose = require("mongoose");
const Xa = require("./xaModel");
const toSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Hãy nhập mã tổ dân phố"],
    unique: [true, "mã tổ dân phố đã được cấp"],
    validate: {
      validator: function (v) {
        return /^([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])$/.test(v);
      },
      message: "Mã tổ dân phố không hợp lệ",
    },
    index: true,
  },
  name: {
    type: String,
    required: [true, "Hãy nhập tên của tổ dân phố"],
    index: true,
  },
  xa: {
    type: String,
    required: [true, "Hãy nhập mã của xã"],
  },
  // thong ke chung cua don vi
  soDan: { type: Number, default: 0 },
  soNam: { type: Number, default: 0 },
  soNu: { type: Number, default: 0 },
  nhoHon15: { type: Number, default: 0 },
  tu15_64: { type: Number, default: 0 },
  hon64: { type: Number, default: 0 },
  daKetHon: { type: Number, default: 0 },
  chuaKetHon: { type: Number, default: 0 },
  lyHon: { type: Number, default: 0 },
  danToc: { type: Object },
  quocTich: { type: Object },
  tonGiao: { type: Object },
  nhomMau: { type: Object },
});
toSchema.post("save", async function (doc) {
  const xa = await Xa.findOne({
    id: doc.xa,
  });
  await Xa.findOneAndUpdate(
    {
      id: doc.xa,
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
