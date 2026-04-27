const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const publicController = require('../controllers/publicController')

//Rutas publicas, cualquier usuario puede acceder a ellas sin necesidad de autenticacion...
router.get("/municipios", publicController.getMunicipios);
router.get("/municipios/:id", publicController.getMunicipiosConPatrimonios);

router.get("/patrimonios", publicController.getAllPatrimonios);
router.get("/patrimonios/:id", publicController.getPatrimonioById);

router.get("/tags", publicController.getAllTags);

//Exportar en PDF
router.get('/patrimonios/:id/reporte', adminController.getPatrimonioParaReporte);

module.exports = router;