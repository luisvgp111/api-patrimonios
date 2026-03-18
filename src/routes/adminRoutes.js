const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require('../middlewares/authMiddleware')

//      Rutas publicas
// Para que el usuario vea la lista de Sonora
router.get("/patrimonios", adminController.getAllPatrimonios);
router.get("/patrimonios/:id", adminController.getPatrimonioById);
router.get("/municipios/:id", adminController.getMunicipiosConPatrimonios);

//      Rutas privadas
// El admin hace uso de la lista de municipios al momento de registrar un patrimonio
router.get("/municipios", auth, adminController.getMunicipios);

// Acciones de edicion del CRUD
router.post("/patrimonios", auth, adminController.createPatrimonio);
router.put("/patrimonios/:id", auth, adminController.updatePatrimonio);
router.delete("/patrimonios/:id", auth, adminController.deletePatrimonio);

module.exports = router;
