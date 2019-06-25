const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');

//defaults options
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:type/:id', function(req,res){
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No file selected'
            }
        });
    }

    //Validate tipo
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Valid types are ' + validTypes.join(' '),
                type
            }
        })
    }

    let file = req.files.file;
    let fileName = file.name.split('.');
    let fileExt = fileName[fileName.length -1];

    //Allowed extensions
    let allowedExt = ['png', 'jpg', 'gif', 'jpeg'];

    if (allowedExt.indexOf( fileExt )<0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Allowed extensions are ' + allowedExt.join(' '),
                ext : fileExt
            }
        })
    }

    //Change filename
    let fileNameModified = `${ id }-${ new Date().getMilliseconds() }.${ fileExt }`;

    file.mv(`uploads/${ type }/${ fileNameModified }`, (err) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // Image already loaded
        type == 'user' ? userImage(id,res,fileNameModified) : productImage(id, res, fileNameModified);
    })

});

function userImage(id, res, fileName) {

    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!userDB) {

            deleteFile(fileName, 'users');

            return res.status(400).json({
                ok:false,
                err : {
                    message: 'User does not exist'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = fileName;

        userDB.save((err,userDB)=>{
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.status(200).json({
                ok:true,
                user: userDB,
                img:fileName
            })
        })
    });

}


function productImage(id, res, fileName) {

    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!productDB) {

            deleteFile(fileName, 'products');

            return res.status(400).json({
                ok:false,
                err : {
                    message: 'Product does not exist'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = fileName;

        productDB.save((err,productDB)=>{
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.status(200).json({
                ok:true,
                product: productDB,
                img:fileName
            })
        })
    });
}


function deleteFile( imageName, type){
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${imageName}`);

        if ( fs.existsSync(pathImage) ){
            fs.unlinkSync(pathImage);
        }
}

module.exports = app;