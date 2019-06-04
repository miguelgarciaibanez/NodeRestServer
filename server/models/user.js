const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let validRoles = {
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email:{
        type: String,
        unique:true,
        required: [true, 'Mail is required']
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

//To avoid sending password in returning creation
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, {message:'{PATH} must be unique'})

module.exports = mongoose.model('User', userSchema);
