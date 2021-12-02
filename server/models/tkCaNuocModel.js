const mongoose = require("mongoose");
const tkCaNuocSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true],
    default: "0",
  },
  name: {
    type: String,
    default: "Việt Nam",
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
const TkCaNuoc = mongoose.model("countries", tkCaNuocSchema);

module.exports = TkCaNuoc;
