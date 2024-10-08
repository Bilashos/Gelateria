const mongoose = require('mongoose');

const ProductTypeEnum = {
    TORTA: 'TORTA',
    GELATO: 'GELATO',
};

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    disponibilita: { type: Number, default: 0 },
    type: { type: String, enum: [ProductTypeEnum.TORTA, ProductTypeEnum.GELATO], required: true },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
