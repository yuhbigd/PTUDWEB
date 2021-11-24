const { Router } = require("express");
const countryController = require("../controllers/countryController");
const { checkUser } = require("../middlewares/authMiddleware");
const router = Router();
router.get("/", countryController.getCountry);
router.post("/", countryController.postCountry);
router.get("/:id", countryController.getCountryByParameter);
module.exports = { router };
