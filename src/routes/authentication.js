'use strict'

const   express    = require('express'),
        router = express.Router(),
        passport = require('passport')
const  {isLoggedIn, isNotLoggedIn} = require('../lib/auth')//verificar si esta autentificado y loggeado
//registro
router.get('/signup', isNotLoggedIn,(req,res) => {
    res.render('auth/signup')
})
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))
//ingreso
router.get('/signin', isNotLoggedIn,(req,res) => {
    res.render('auth/signin')
})
router.post('/signin', isNotLoggedIn,(req,res,next) => {
    passport.authenticate('local.signin',{
        successRedirect: '/profile',//pantalla de exito en autentificacion
        failureRedirect: '/signin', //pantalla de error en autentificacion
        failureFlash: true
    })(req,res,next)
})
//pantalla de incio loggedo
router.get('/profile',isLoggedIn, (req,res) => {
    res.render('profile')
})
router.get('/logout',isLoggedIn, (req,res) => {
   req.logOut();
   res.redirect('/signin');
})

module.exports = router 