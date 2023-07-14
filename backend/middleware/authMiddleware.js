const jwt = require ('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require ('../models/usersModel')

const protect = asyncHandler ( async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Obtener el token del header de autorizacion
            token = req.headers.authorization.split(' ')[1]

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // obtengolos datos del usuario del token
            req.user =  await User.findById(decoded.id).select('-password')
            next()

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error ('Acceso no autorizado')
        }
    }

    if(!token) {
        res.status(401)
        throw new Error ('No fue proporcionado el Token')
    }
})

module.exports = { protect }