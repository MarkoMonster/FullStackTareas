const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const registerUser = asyncHandler ( async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Faltan datos')
    }

    // Verficar si el usuario existe
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error('Ese usuario ya existe, favor de verificar');
    }

    // Hash al passoword
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crear el usuario
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    // si se pudo crear el usuario lo muestra en la respuesta
    // en caso contrario lanza un error
    if(user) {
        res.status(201).json({
            _id:   user._id,
            name:  user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Hubo en error, intentalo de nuevo')
    }
})

const loginUser = asyncHandler ( async (req, res) => {
    const {email, password} = req.body;

    // Verificamos que el usuario exista
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password ))){
        res.status(200).json({
            _id:   user._id,
            name:  user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Credenciales incorrectas')
    }

    res.json({message: 'Login usuario'})
})

const getUserData = asyncHandler ( async (req, res) => {
    res.json(req.user)
})

const generateToken = (id) => {
    // el token se forma por
    //jwt.sign({dato a encriptar}, palabra secreta que esta en las variables de entorno, el tiempo de de expiraciondel token)
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    getUserData
}