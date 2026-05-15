const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { isSupremo } = require("../middlewares/roleMiddleware");
const adminManagementController = require("../controllers/adminManagementController");

router.use(auth, isSupremo);

// CRUD de administradores (solo rol 'admin_supremo' puede acceder)
router.get("/admins", adminManagementController.listarAdmins);
router.get("/admins/:id", adminManagementController.getAdminById);
router.post("/admins", adminManagementController.crearAdmin);
router.put("/admins/:id", adminManagementController.editarAdmin);
router.delete("/admins/:id", adminManagementController.eliminarAdmin);

module.exports = router;