const productController = require('../controllers/product.controller');
const express = require('express');
const { verifyToken } = require('../middlewares/token');
const router = express.Router();

// Rotta per ottenere tutti i prodotti
router.get('/', verifyToken, productController.getProduct);
// Rotta per ottenere singolo prodotto
router.get('/:productId', productController.getSingleProduct);
// Rotta per creare un prodotto
router.post('/create-product', productController.createProduct);


module.exports = router;
