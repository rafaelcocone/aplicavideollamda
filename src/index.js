'use strict'

//varibles globales
//variables
var fs = require('fs'),
    https = require('https'),
    puerto = 4000,
    options = {
        /*key:  fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')*/
        key:  fs.readFileSync('_.mrbisne.com_private_key.key'),
        cert: fs.readFileSync('mrbisne.com_ssl_certificate.cer')
    }

const express = require('express'),
    app     = express(),
    morgan      = require('morgan'),//generador de plantillas
    exphbs  = require('express-handlebars'),
    path    =  require('path'),
    flash       = require('connect-flash'),//cuadros dfe mensajes
    session     = require('express-session'),//sessiones
    MySQLStore  = require('express-mysql-session'),//ssesiones de mysql par abase de datos
    passport    = require('passport'),
    SocketIO = require('socket.io')
    //,    { PeerServer, ExpressPeerServer } = require('peer');
    

const   server = https.createServer(options, app)
const  io = SocketIO(server);
const {database} = require('./keys')
/*
const peerServer = ExpressPeerServer(server,{
    debug:true
})
*/

require('./lib/passport')



//settings
app.set('port',process.env.PORT || puerto)

app.set('views', path.join(__dirname,'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')


///middleware
app.use(session({//guardado de seecion en base de datos 
    secret: 'mensajeroMysqlSession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash())//uso de mensajes y notificaciones


app.use( morgan('dev') )
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize())//inicializar paasport
app.use(passport.session())

//variables
app.use((req,res,next) => {
    app.locals.success =  req.flash('success')
    app.locals.message =  req.flash('message')
    app.locals.user    =  req.user
    next();
})



//routes (conecciones aroutes/indes.js)
app.use(require('./routes'))
app.use(require('./routes/authentication'))
app.use('/links',require('./routes/links'))
app.use('/agenda',require('./routes/agenda'))




//app.use('/peerjs',peerServer)
app.use('/videollamada',require('./routes/videollamada')(io))
app.use('/grabadora',require('./routes/grabadora'))
//app.use('/meet',require('./routes/meet'))


//public
app.use(express.static(path.join(__dirname,'public')))


//start server
server.listen(app.get('port'), () => { console.log("server port",app.get('port')) });

