const express = require('express');
let app = express();

let Category = require('../models/category');
let Product = require('../models/product');

const { verifyToken, verifyRole } = require('../middlewares/authentication');

/**
 * Return all categories
 */
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec()
        .then(async(categories) => {
            // Return total count of categories in DB
            let totalCategories = await Category.countDocuments();

            res.json({
                ok: true,
                categories,
                totalCategories
            });
        })
        .catch(err => {
            res.status(400).json({
                ok: false,
                err
            });
        });

});

/**
 * Return the requested category
 */
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id)
        .populate('user', 'name email')
        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (category === null) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Category not found'
                    }
                });
            }
            res.json({
                ok: true,
                category,
            });
        });
});

/**
 * Create a new category
 */
app.post('/category', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description ? body.description.trim() : '',
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            category: categoryDB
        })

    });

});

/**
 * Update the requested category
 */
app.put('/category/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = {
        description: req.body.description ? req.body.description.trim() : '',
        user: req.user._id
    };
    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Category.findByIdAndUpdate(id, body, options, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (categoryDB === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            user: categoryDB
        });
    })
});

/**
 * Delete the requested category
 */
app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, async(err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (deletedCategory === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        // Delete all products associated with that category
        await Product.deleteMany({ category: deletedCategory._id });

        res.json({
            ok: true,
            category: {
                message: `The category was deleted`
            }
        });
    });
});

module.exports = app;