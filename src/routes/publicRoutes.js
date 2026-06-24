const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const {procesarContacto} = require('../controllers/contactController')

router.get("/municipios", publicController.getMunicipios);
router.get("/municipios/:id", publicController.getMunicipiosConPatrimonios);
router.get("/patrimonios", publicController.getAllPatrimonios);
router.get("/patrimonios/:id", publicController.getPatrimonioById);
router.get("/tags", publicController.getAllTags);
router.get('/patrimonios/:id/reporte', publicController.getPatrimonioParaReporte);

router.post("/contacto", procesarContacto);

module.exports = router;