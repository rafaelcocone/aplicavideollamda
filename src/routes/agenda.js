'use strict'

const   express     = require('express'),
        router      = express.Router(),
        pool        = require('../database')
const  {isLoggedIn} = require('../lib/auth')//verificar si esta autentificado y loggeado


router.get('/',isLoggedIn, async(req,res) => {
   /* var sql = 'SELECT  * FROM tickets '  
        sql += 'WHERE id_user = ? OR id_experto = ?'****/





    const tickets = await pool.query(sql, [req.user.id, req.user.id] )
    res.render('agenda/list', {tickets: tickets})
})



module.exports = router