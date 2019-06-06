const express = require('express');
const mongoose = require('mongoose');
require('./config/config');
const app = express();


//Global routes configconfig
app.use( require('./routes/index') );




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