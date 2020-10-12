'use strict'
const bcrypt = require('bcryptjs')

const helpers = {}
//encriptacion de password
helpers.encryptPassword = async  (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)//password final
    return hash
}

//comprobar contraseña resibidas
helpers.matchPassword = async (password,savedPassword) => {
    try{
        return await bcrypt.compare(password,savedPassword)
    }catch(e){
        console.log(e)
    }   
}

module.exports = helpers