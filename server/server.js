const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('./config/config');
const app = express();


//Global routes configconfig
app.use( require('./routes/index') );

//Enable public
app.use(express.static(path.resolve(__dirname,'../public')));
//console.log(__dirname + '../public');
//console.log(path.resolve(__dirname,'../public'));

mongoose.connect(process.env.URLDB,
                 {useNewUrlParser: true, useCreateIndex:true},
                 (err, res)=>{
    if (err) {
        throw err;
    }

    console.log('Database Online');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto:', process.env.PORT);
})