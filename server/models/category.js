const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const User = require('./user')

let categorySchema = new Schema({
    description: {
        type:String,
        unique: true,
        required: [true, 'Description is required'] 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required:[true, 'User is required'],
        ref:'User'
    }
})

module.exports = mongoose.model('Category',categorySchema);