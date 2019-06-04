
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

/**
 * Body parser
 */
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/user', function (req, res) {
    // res.json('get User');

    let fromreq = req.query.from || 0;
    fromreq = Number(fromreq);

    let bypage = req.query.bypage || 0;
    bypage = Number(bypage);

    User.find({status:true},'name email role status google img') //Send only the fields included in the query
        .skip(fromreq)
        .limit(bypage)
        .exec((err, users)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({status:true},(err,count)=>{
                res.json({
                    ok:true,
                    users,
                    count: count
                })
            })
            
        })
});

app.post('/user', (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.put('/user/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body,['name','email','role','status']);

    User.findByIdAndUpdate(id, body, {new:true, runValidators:true},(err, userDB)=>{
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok:true,
            user:userDB
        });
    });

    
});


app.delete('/user/:id', (req, res) => {
    // res.json('delete User');

    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userRemoved)=>{
    let changeStatus = {
        status: false
    }

    User.findByIdAndUpdate(id, changeStatus, {new:true}, (err, userRemoved)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (_.isNull(userRemoved)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }
        res.json({
            ok:true,
            user: userRemoved
        });

    });


});


module.exports = app;