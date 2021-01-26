'use strict'

const  express = require('express'),
        pool      = require('../database') //hace referencia al archivo en ../database.js
const  {isLoggedIn} = require('../lib/auth')//verificar si esta autentificado y loggeado
var id_usuario = undefined

module.exports = function(io) {
    let router = express.Router()

    // define routes
    router.get('/', (req, res) => {
        req.flash('message','No fue seleccionada una room')
        res.render('profile')
    })
    
    /*router.get('/:room', (req, res) => {
        const roomId =  req.params.room
      res.render('videollamada/videollamada', { roomId })
    })*/ 
    
    router.get('/meet', (req, res) => {
      res.render('videollamada/meet', { ticket: [] })
  })


  router.get('/singlepeer', (req, res) => {
    res.render('videollamada/singlepeer', { ticket: [] })
})


    
    router.get('/:room', isLoggedIn,async(req,res) => {

      var roomId  =  null,
            userId =  null,
            sqle  = "",
            errorType = '',
            ticket = [0]
      const veee = undefined
      try{

        if(typeof req.params.room === 'undefined')
          throw 'Ticket de videollamada no fue localizado'
        roomId  =  req.params.room

        if(typeof  req.user.id === 'undefined')
          throw 'El Id del usuario no ha sido localizado'
        userId =   req.user.id
        id_usuario =   req.user.id

        if( roomId == '10')
          throw ''
        else{

          sqle = ' SELECT  DISTINCT    * FROM gruposintegrantes ';
          sqle += ' INNER JOIN grupos 				ON grupos.id = gruposintegrantes.id_grupos';
          sqle += ' inner JOIN comunicacionRlRoomContactos ON comunicacionRlRoomContactos.id_gruposintegrantes  = gruposintegrantes.id';
          sqle += ' where grupos.tipo = "S" AND gruposintegrantes.state = "A" AND grupos.state = "A"';
          sqle += ' AND comunicacionRlRoomContactos.id_comunicacionCtRoom = ? AND gruposintegrantes.id_users = ? limit 1';
        
         ticket = await pool.query(sqle,[roomId, userId])
         console.log( ticket)
          if(ticket.length > 0 )
            throw ''

          ticket = await pool.query('SELECT * FROM tickets WHERE id_ticket = ? limit 1',[ roomId])
          if(ticket.length == 0 )
            throw 'El ticket no ha sido localizado'

          if(ticket[0].id_user === userId )
            throw ''

          if(ticket[0].id_experto === userId )
            throw ''
          throw 'El usuario no esta asigando a este ticket'
        }
   
      } catch($e){
        errorType = $e
      }


      if(errorType === ''){
       /* res.redirect('https://mrbisne.com:3003/'+roomId);*/

       
        res.render('videollamada/videollamada', { ticket: ticket[0], 
          name: req.user.name, 
          id_usuario: id_usuario,
          email: req.user.email,
          roomId: roomId   })

      }
        
      else{
        req.flash('message',errorType)
        res.render('profile')
      }
        
    }) 
     

   


    // io is available in this scope
    /*************************************** */
    io.on('connection', socket => {
        socket.on('join-room', (roomId, userId) => {
            console.log('coneccion a room '+ roomId, userId);
            socket.join(roomId)
            socket.to(roomId).emit('user-connected', {userId})
           
            io.in(roomId).clients((error, clients) => {
              if (error) throw error;
              console.log('grupo: '+ roomId + 'clientes en grupo:');
              console.log(clients); 
            });
  
            socket.on('confirmacionConeccion', (data) => {
              //send message to reconecte
              socket.to(roomId).broadcast.emit('confirmacionRespuesta', data)
            });
  
            socket.on('message', (message) => {
              //send message to the same room
              io.to(roomId).emit('createMessage', message)
            }); 
  
            socket.on('disconnect', () => {
              console.log('desconeccion: '+userId)
              socket.to(roomId).broadcast.emit('user-disconnected', userId)
              io.clients((error, clients) => {
                if (error) throw error;
                console.log('clientes restantes:');
                console.log(clients); 
              });
            })
        })
      })



    return router;
}