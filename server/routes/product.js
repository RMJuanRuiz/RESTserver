const express = require('express');
const mongoose = require('mongoose');
const _ = require('underscore');
const { verifyToken, verifyRole } = require('../middlewares/authentication');

const app = express();

let Product = require('../models/product');
let Category = require('../models/category');


/**
 * Return all products
 */
app.get('/product', verifyToken, (req, res) => {
    let from = req.query.from > 0 ? Number(req.query.from - 1) : 0;
    let until = req.query.until > 0 ? Number(req.query.until) : 5;

    Product.find({ available: true })
        .skip(from)
        .limit(until)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec(async(err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Return total count of available products in DB
            let totalProducts = await Product.countDocuments({ available: true });

            res.json({
                ok: true,
                products,
                totalProducts
            });

        });
});

/**
 * Return the requested product
 */
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (product === null) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                });
            }
            res.json({
                ok: true,
                product,
            });
        });
});

/**
 * Search products
 */
app.get('/product/search/:search', verifyToken, (req, res) => {
    let search = req.params.search;
    let regex = new RegExp(search, 'i');

    Product.find({ name: regex })
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products,
            });

        });

});



/**
 * Create a new product
 */
app.post('/product', [verifyToken, verifyRole], async(req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    });


    if (body.category) {
        if (mongoose.Types.ObjectId.isValid(body.category)) {
            if (!await Category.exists({ _id: body.category })) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error, category not found'
                    }
                });
            }
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error, It is not a valid ID'
                }
            });
        }
    }

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })

    });
});

/**
 * Update the requested product
 */
app.put('/product/:id', [verifyToken, verifyRole], async(req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'price', 'description', 'available', 'category']);
    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    if (body.category) {
        if (mongoose.Types.ObjectId.isValid(body.category)) {
            if (!await Category.exists({ _id: body.category })) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error, category not found'
                    }
                });
            }
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error, It is not a valid ID'
                }
            });
        }
    }

    Product.findByIdAndUpdate(id, body, options, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (productDB === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    })

});

/**
 * Delete the requested product
 */
app.delete('/product/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        available: false
    }

    Product.findByIdAndUpdate(id, changeStatus, (err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (deletedProduct === null || !deletedProduct.available) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: {
                message: `Product ${deletedProduct.name} was deleted`
            }
        });

    });

});

module.exports = app;