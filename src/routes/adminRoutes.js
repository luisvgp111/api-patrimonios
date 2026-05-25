const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");
const { isAdmin, isSupremo } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/upload");

router.use(auth, isAdmin);

router.get("/patrimonios", adminController.getAllPatrimoniosAdmin);
router.patch("/patrimonios/:id/estado", isSupremo, adminController.cambiarEstadoPatrimonio);
router.get("/exportar-excel", adminController.exportarPatrimonios);
router.post(
  "/patrimonios",
  upload.fields([{ name: "portada", maxCount: 1 }, { name: "imagenes", maxCount: 10 }]),
  adminController.createPatrimonio
);
router.put(
  "/patrimonios/:id",
  upload.fields([{ name: "portada", maxCount: 1 }, { name: "imagenes", maxCount: 10 }]),
  adminController.updatePatrimonio
);
router.delete("/patrimonios/:id", adminController.deletePatrimonio);


router.put("/tags/:id", adminController.updateTag);
router.delete("/tags/:id", adminController.deleteTag);

module.exports = router;