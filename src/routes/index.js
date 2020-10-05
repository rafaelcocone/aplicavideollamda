//almacenar rutas principales
'use strict'

const   express = require('express'),
    router = express.Router();

    router.get('/', (req,res) => {
        res.send('hello world')
    })

module.exports = router