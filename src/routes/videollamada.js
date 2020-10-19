'use strict'

/*const   express   = require('express'),
        router    = express.Router(),
        pool      = require('../database') //hace referencia al archivo en ../database.js
      

const { isObject } = require('util')
        const { v4: uuidV4 } = require('uuid')
        

router.get('/', (req, res) => {
    req.flash('message','No fue seleccionada una room')
    res.render('profile')
})

router.get('/:room', (req, res) => {
    const roomId =  req.params.room
    console.log(roomId)
  res.render('videollamada/videollamada', { roomId })
}) 



module.exports = router/*/

const  express = require('express'),
        pool      = require('../database') //hace referencia al archivo en ../database.js

module.exports = function(io) {
    let router = express.Router()

    // define routes
    router.get('/', (req, res) => {
        req.flash('message','No fue seleccionada una room')
        res.render('profile')
    })
    
    router.get('/:room', (req, res) => {
        const roomId =  req.params.room
      res.render('videollamada/videollamada', { roomId })
    }) 
    
    // io is available in this scope
    /*************************************** */
    io.on('connection', socket => {
        socket.on('join-room', (roomId, userId) => {
            console.log('coneccion a room '+ roomId, userId);
            socket.join(roomId)
            socket.to(roomId).broadcast.emit('user-connected', userId)
           
            io.in(roomId).clients((error, clients) => {
              if (error) throw error;
              console.log('grupo: '+ roomId + 'clientes en grupo:');
              console.log(clients); 
            });
  
            socket.on('areyouhere', (id_room) => {
              //send message to reconecte
             
              console.log('are you here?:');
              console.log(userId);
              socket.to(roomId).broadcast.emit('user-connected', userId)
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