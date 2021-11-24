const { Router } = require("express");
const countryController = require("../controllers/countryController");
const { checkUser } = require("../middlewares/authMiddleware");
const router = Router();
router.get("/")
module.exports = { router };
