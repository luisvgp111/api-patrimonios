const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/upload");

// Todas estas rutas requieren autenticación y rol de administrador (admin o supremo)
router.use(auth, isAdmin);

// Exportar Excel
router.get("/exportar-excel", adminController.exportarPatrimonios);

// CRUD de patrimonios
router.post(
  "/patrimonios",
  upload.fields([
    { name: "portada", maxCount: 1 },
    { name: "imagenes", maxCount: 10 },
  ]),
  adminController.createPatrimonio
);
router.put(
  "/patrimonios/:id",
  upload.fields([
    { name: "portada", maxCount: 1 },
    { name: "imagenes", maxCount: 10 },
  ]),
  adminController.updatePatrimonio
);
router.delete("/patrimonios/:id", adminController.deletePatrimonio);

// Gestión de tags
router.put("/tags/:id", adminController.updateTag);
router.delete("/tags/:id", adminController.deleteTag);

module.exports = router;