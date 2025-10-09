// server/models/Product.js

const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: false, // Description is optional
            maxlength: 500,
        },
        image_url: {
            type: String,
            required: true,
        },
        // --- Core Link Verification Fields ---
        purchase_link: {
            type: String,
            required: true,
            unique: true, // Prevents duplicate links in the database
        },
        is_link_valid: {
            type: Boolean,
            required: true,
            default: false, // Default to false until successfully verified
        },
        platform_source: {
            type: String, // e.g., 'Amazon', 'Flipkart', 'Other'
            required: false,
        },
        // ------------------------------------
        
        // Optional: Reference to the user who uploaded it
        // uploaded_by: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        // },

    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;