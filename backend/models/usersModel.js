const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Ingresa un nombre de usuario']
    },
    email: {
        type: String,
        required: [true, 'Ingresa un email válido'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'Ingresa un password']
    }

},{
    timestamps: true
})

module.exports =  mongoose.model('User', userSchema)