'use strict'

const   express     = require('express'),
        router      = express.Router(),
        pool        = require('../database')

//const  {isLoggedIn} = require('../lib/auth')//verificar si esta autentificado y loggeado

router.get('/add', (req,res) =>{
    res.render('links/add')
});
/*
router.post('/add',isLoggedIn,async(req,res) => {
    //decosntruir formulario
    const {title, url, descripcion}  = req.body
    //construir array a guardar
    const newLink = {
        title,
        url,
        descripcion
    };
    //envio a guardar datos
    await pool.query('INSERT INTO links set ?' ,[newLink] )
    req.flash('success','Link Guardado satisfatoriamente');
    res.redirect('/links')
})
router.get('/',isLoggedIn, async(req,res) => {
    const links = await pool.query('SELECT  * FROM links')
    res.render('links/list', {links: links})
})
router.get('/delete/:id', isLoggedIn,async(req,res) => {
    const {id} = req.params
    const links = await pool.query('DELETE FROM links where id = ?',[id])
    req.flash('success','Link eliminado satisfatoriamente');
    res.redirect('/links')
})
router.get('/edit/:id', isLoggedIn,async(req,res) => {
    const {id} = req.params
    const link = await pool.query('SELECT *FROM links WHERE id = ?',[id])
    res.render('links/edit',{link:link[0]});
})
router.post('/edit/:id',isLoggedIn, async(req,res) => {
    //decosntruir formulario
    const {id} = req.params
    const {title, url, descripcion}  = req.body
    //construir array a guardar
    const updateLink = {
        title,
        url,
        descripcion
    };
    //envio a guardar datos
    await pool.query('UPDATE links set ? WHERE id =  ?' ,[updateLink,id] )
    req.flash('success','Link editado satisfatoriamente');
    res.redirect('/links')
})
*/





module.exports = router