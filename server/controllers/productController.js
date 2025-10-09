// server/controllers/productController.js

const Product = require('../models/Product');
const verifyLink = require('../utils/linkVerifier');

// @desc    Create a new product listing (and verify the link)
// @route   POST /api/products
// @access  Public (for now)
const createProduct = async (req, res) => {
    const { name, description, image_url, purchase_link } = req.body;

    // Basic Input Validation
    if (!name || !image_url || !purchase_link) {
        return res.status(400).json({ 
            message: 'Please provide product name, image URL, and purchase link.' 
        });
    }

    try {
        // --- CORE VALIDATION STEP ---
        const verificationResult = await verifyLink(purchase_link);

        if (!verificationResult.isValid) {
            // BLOCK THE UPLOAD if the link is invalid or untrusted
            return res.status(400).json({ 
                message: 'Link verification failed.',
                error: verificationResult.error 
            });
        }
        
        // If verification passed, create the product instance
        const product = await Product.create({
            name,
            description,
            image_url,
            purchase_link,
            is_link_valid: true, // Set to TRUE only upon successful verification
            platform_source: verificationResult.source,
        });

        // Send back the newly created product
        res.status(201).json({ 
            message: 'Product uploaded successfully and link verified!',
            product 
        });

    } catch (error) {
        // Handle database errors (e.g., duplicate unique link)
        if (error.code === 11000) {
             return res.status(409).json({ 
                message: 'A product with this purchase link already exists.',
                error: error.message
            });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error during product creation.' });
    }
};

// @desc    Fetch all valid products (for front-end display)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        // Only fetch products where the link is verified (is_link_valid: true)
        const products = await Product.find({ is_link_valid: true }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching products.' });
    }
};

module.exports = {
    createProduct,
    getProducts,
};