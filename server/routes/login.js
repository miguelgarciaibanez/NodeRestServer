const express = require('express');

const User = require('../models/user');

const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Google configuration

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }
  //verify().catch(console.error);

app.post('/google', async (req,res)=> {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
                    .catch( e=>{
                        console.log(e);
                        return res.status(403).json({
                            ok:false,
                            err:e
                        })
                    });
        
    User.findOne({email: googleUser.email},(err,userDb)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });   
        };

        if (userDb){
            if (userDb.google === false){
                return res.status(400).json({
                    ok: false,
                    err :{
                        message: 'You should user your normal authentication'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDb
                }, process.env.TOKEN_SEED, {expiresIn: process.env.TOKEN_EXPIRATION});

                return res.json({
                    ok: true,
                    user: userDb,
                    token
                });
            }
        } else {
            //User does not exists in our database
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.password = ':)';

            user.save( (err, userDb) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userDb
                }, process.env.TOKEN_SEED, {expiresIn: process.env.TOKEN_EXPIRATION});

                return res.json({
                    ok: true,
                    user: userDb,
                    token
                });

            });
        }
    });
});
module.exports = app;