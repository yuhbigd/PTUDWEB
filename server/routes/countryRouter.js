const { Router } = require("express");
const countryController = require("../controllers/countryController");
const router = Router();
router.get("/", countryController.getCountry);
router.post("/", countryController.postCountry);
router.get("/:id", countryController.getCountryByParameter);
router.put("/:id", countryController.putCountry);
router.delete("/:id", countryController.deleteCountry);
module.exports = { router };
