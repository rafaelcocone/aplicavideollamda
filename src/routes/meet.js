
  'use strict'

const   express     = require('express'),
        router      = express.Router(),
        pool        = require('../database')
const  {isLoggedIn} = require('../lib/auth')//verificar si esta autentificado y loggeado


router.get('/', (req, res) => {
    res.render('meet/meet', { ticket: [] })
  })




module.exports = router