const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Solo login (el registro se maneja desde el panel del supremo)
router.post("/login", authController.login);

module.exports = router;