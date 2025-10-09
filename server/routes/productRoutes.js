// server/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');

// Define routes
router.route('/')
    .get(getProducts)    // GET to fetch all verified products
    .post(createProduct); // POST to create a new product (with verification)

module.exports = router;