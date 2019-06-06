const express = require('express');

const User = require('../models/user');

const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

const app = express();


app.post('/login', (req,res)=> {

    let body = req.body;

    User.findOne({email: body.email}, (err, userDb)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

            
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Wrong user and/or password. User"
                }
            });
        }

        if (!bcrypt.compareSync( body.password, userDb.password )){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Wrong user and/or password. Password"
                }
            });
        }

        let token = jwt.sign({
            user: userDb
        }, process.env.TOKEN_SEED, {expiresIn: process.env.TOKEN_EXPIRATION});

        res.json({
            ok:true,
            user: userDb,
            token //because token field and value has the very same name
        });
    })
});

module.exports = app;