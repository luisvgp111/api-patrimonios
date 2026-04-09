const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require('../middlewares/authMiddleware')
const publicController = require("../controllers/publicController")
const upload = require('../middlewares/upload')

//      Rutas privadas
// El admin hace uso de la lista de municipios al momento de registrar un patrimonio
router.get("/municipios", auth, publicController.getMunicipios);
router.get("/patrimonios", publicController.getAllPatrimonios);
router.get("/patrimonios/:id", publicController.getPatrimonioById);

// Acciones del CRUD para patrimonios
router.post("/patrimonios", auth, upload.single('imagen'), adminController.createPatrimonio);
router.put("/patrimonios/:id", auth, upload.single('imagen'), adminController.updatePatrimonio);
router.delete("/patrimonios/:id", auth, adminController.deletePatrimonio);

//Acciones para Tags
router.get("/tags", publicController.getAllTags);
router.put("/tags/:id", auth, adminController.updateTag);
router.delete("/tags/:id", auth, adminController.deleteTag);

module.exports = router;
