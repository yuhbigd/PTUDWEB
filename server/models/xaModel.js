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
xaSchema.post("save", async function (doc) {
  const huyen = await Huyen.findOne({
    id: doc.huyen,
  });
  await Huyen.findOneAndUpdate(
    {
      id: doc.huyen,
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
