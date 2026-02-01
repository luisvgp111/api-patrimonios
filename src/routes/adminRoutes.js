const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')

router.get('/', adminController.getAllPatrimonios);
router.get('/:id', adminController.getPatrimonioById);
router.post('/', adminController.createPatrimonio);
router.put('/:id', adminController.updatePatrimonio);
router.delete('/:id', adminController.deletePatrimonio)

module.exports = router;