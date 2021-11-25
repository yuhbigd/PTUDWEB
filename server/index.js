const express = require("express");
const cookie_Parse = require("cookie-parser");
const mongoose = require("mongoose");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

global.fetch = fetch;
const _ = require("lodash");
const cors = require("cors");
global._ = _;

require("dotenv").config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookie_Parse());
app.use(express.static("public"));

const authRouter = require("./routes/authRouter");
const countryRouter = require("./routes/countryRouter");
const accountRouter = require("./routes/accountRouter");
// check user middleware
const { checkUser } = require("./middlewares/authMiddleWare");
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    return result;
  })
  .catch((err) => console.log(err));

// enable cors for localhost
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
  );
  next();
});
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/", authRouter.router);
app.use("/country", [checkUser], countryRouter.router);
app.use("/account", [checkUser], accountRouter.router);
app.listen(3001, () => {
  console.log("server is listen on port 3001");
});
