const express = require('express');
const {verifyTokenImg} = require('../middlewares/auth');
const fs = require('fs');
const path = require('path');

let app = express();

app.get('/images/:type/:img',verifyTokenImg , (req, res)=>{

    let type = req.params.type,
        img = req.params.img;
    
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${img}`);
    
    

    if (fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

})

module.exports = app;