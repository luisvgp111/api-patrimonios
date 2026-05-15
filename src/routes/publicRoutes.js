const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get("/municipios", publicController.getMunicipios);
router.get("/municipios/:id", publicController.getMunicipiosConPatrimonios);
router.get("/patrimonios", publicController.getAllPatrimonios);
router.get("/patrimonios/:id", publicController.getPatrimonioById);
router.get("/tags", publicController.getAllTags);
router.get('/patrimonios/:id/reporte', publicController.getPatrimonioParaReporte); // ← moverlo aquí (era de admin)

module.exports = router;