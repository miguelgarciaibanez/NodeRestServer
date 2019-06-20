const express = require('express');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');
const app = express();
const Category = require('../models/category');
const _ = require('underscore');

/**
 * Body parser
 */
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ===================
// Show all categories
// ===================
app.get('/category', verifyToken, function (req, res) {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categories
        })
    });
});

// ========================
// Show one category by ID
// ========================
app.get('/category/:id', verifyToken, function (req, res) {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB){
            return res.status(400).json({
                ok:false,
                message: 'Category not found'
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
});


// ========================
// Create new category
// ========================
app.post('/category', verifyToken, function (req, res) {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// ========================
// Update category
// ========================
app.put('/category/:id', verifyToken, function (req, res) {
    let id = req.params.id;
    let description = req.body.description;

    Category.findByIdAndUpdate(id, { description: description }, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
});

// ========================
// Delete category
// ========================
app.delete('/category/:id', [verifyToken, verifyAdminRole], function (req, res) {
    //Only admin
    //Category.findByIdAndRemove

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryRemoved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryRemoved
        })

    });
})

module.exports = app;