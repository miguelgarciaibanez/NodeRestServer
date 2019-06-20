const express = require('express');

const {verifyToken} = require('../middlewares/auth');

let app = express();
let Product = require('../models/product');

/**
 * Body Parser
 */
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// ===================
// get all products
// ===================
app.get('/products',verifyToken, (req, res) => {
    //trae todos los productos
    //populate: user category
    //pages
    let fromreq = req.query.from || 0;
    fromreq = Number(fromreq);

    let bypage = req.query.bypage || 0;
    bypage = Number(bypage);
    Product.find({ available: true },'name priceUni description available')
        .skip(fromreq)
        .limit(bypage)
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err,products)=> {
            if (err) {
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                products
            })
        })

});

// ===================
// get one product
// ===================
app.get('/products/:id', verifyToken, (req, res) => {
    //populate: user category
    let id = req.params.id;

    Product.findById(id )
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err,productDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message : 'Product not found'
                }
            })
        }

        res.status(200).json({
            ok:true,
            product: productDB
        })
    });
});


// ===================
// create new product
// ===================
app.post('/products', verifyToken, (req, res) => {
    //save user
    //save category
    let body = req.body;

    let product = new Product({
        name: body.name,
        priceUni: body.priceUni,
        description: body.description,
        available: true,
        user: req.user._id,
        category: body.category
    });

    product.save((err,productDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            })
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })
    })
});

// ===================
// Serarch a product
// ===================
app.get('/products/search/:term',verifyToken,(req,res)=>{

    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    Product.find({name:regex})
        .populate('category','description')
        .exec((err, products)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            
            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Products not found'
                    }
                })
            }

            res.status(200).json({
                ok: true,
                products
            })
        })
});

// ===================
// update a product
// ===================
app.put('/products/:id', verifyToken, (req, res) => {
    //save user
    //save category
    let id = req.params.id;

    let body = req.body;

    // Products.findByIdAndUpdate(id, {
    //     name: body.name,
    //     priceUni: body.priceUni,
    //     description: body.description,
    //     available: body.available,
    //     category: body.category
    // }, {new: true, runvalidators:true}, (err, productDB) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if (!productDB) {
    //         return res.status(400).json({
    //             ok:false,
    //             err: {
    //                 message: 'Product not found'
    //             }
    //         })
    //     }

    //     res.status(200).json({
    //         ok: true,
    //         product: productDB
    //     });
    // })

    Product.findById (id, (err, productDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            })
        }

        productDB.name = body.name;
        productDB.priceUni = body.priceUni;
        productDB.category = body.category;
        productDB.available = body.available;
        productDB.description = body.description;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            
            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                })
            }

            res.status(200).json({
                ok: true,
                product: productSaved
            })
        })
    })
});

// ===================
// delete a product
// ===================
app.delete('/products/:id', verifyToken, (req, res) => {
    //set available to false
    let id = req.params.id;
    let body = req.body;    

    // Product.findByIdAndRemove(id, (err, productRemoved) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!productRemoved){
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Product not found'
    //             }
    //         });
    //     }

    //     res.statys(200).json({
    //         ok: true,
    //         product: productDB
    //     })
    // })

    let changeStatus = {
        available: false
    }

    Product.findByIdAndUpdate(id, changeStatus, {new:true}, (err, productRemoved)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productRemoved){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }
        res.json({
            ok:true,
            user: productRemoved
        });

    });
});

module.exports = app;