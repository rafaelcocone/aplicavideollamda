const   passport        = require('passport'),
        localStrategy   = require('passport-local').Strategy
const   pool            = require('../database');
const   helpers         = require('../lib/helpers')

//Ingresar
passport.use('local.signin', new localStrategy({
    usernameField: 'email',//nombre de usuario
    passwordField: 'password',//password
    passReqToCallback: true//permitir agregar otros datos en ingreso
}, async (req,username,password,done) => {
    const results  = await pool.query('SELECT * FROM users WHERE email = ? ', [username])
    if(results.length == 0)
        return done(null,false,req.flash('message','Email no esta registrado'));
    else{
        const user = results[0]
        const validPassword = await helpers.matchPassword(password,user.password)
        if(validPassword)
            done(null,user,req.flash('success','Bienvenido '+user.name))
        else
            done(null,false,req.flash('message','Password Incorrecto'))
    }
}))


//registrar un nuevo usuario
passport.use('local.signup', new localStrategy({
    usernameField: 'email',//nombre de usuario
    passwordField: 'password',//password
    passReqToCallback: true//permitir agregar otros datos en registro

}, async (req,username, password,done) => {
    const { fullname} = req.body
    const newUser = {
        email:  username,
        password,
        name:   fullname
    }
    //encryptar password
    newUser.password    = await  helpers.encryptPassword(password)
    //creacion de nuevo usuario
    const results       = await pool.query('INSERT INTO users set ? ',[newUser]); 
    //set nuevo id en el objeto new user
    newUser.id = results.insertId
    return done(null, newUser)

}));

//serializa usuario
passport.serializeUser((usr,done) => {
    done(null,usr.id)
})

//deserializa usuario
passport.deserializeUser(async (id,done) => {
    const results       = await pool.query('SELECT * FROM users WHERE id = ? ',[id]); 
    done(null,results[0])
})