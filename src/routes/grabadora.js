'use strict'

const   express     = require('express'),
        router      = express.Router(),
        pool        = require('../database')
const  {isLoggedIn} = require('../lib/auth')//verificar si esta autentificado y loggeado


router.get('/',isLoggedIn, async(req,res) => {
   
    res.render('grabadora/grabadora', {tickets: []})
})



module.exports = router