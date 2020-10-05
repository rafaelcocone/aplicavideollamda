'use strict'

//variables
var fs = require('fs'),
    https = require('https'),
    puerto = 4000,
    options = {
        key:  fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }

const   express = require('express'),
        morgan  = require('morgan'),
        exphbs  = require('express-handlebars'),
        path    = require('path')


//inicializaciones
const app = express()
const   server = https.createServer(options, app)

//settieng

app.set('port', process.env.PORT || puerto)
app.set('views',path.join(__dirname),'views' )

app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs')



//const  SocketIO = require('socket.io')
//const   io = SocketIO(server);


//middleware
app.use( morgan('dev') )
app.use( express.urlencoded({extended: false}) )
app.use( express.json() )

//variables globales
app.use((req,res,next) => {
    next()
})

//routes
app.use(require('./routes'))
app.use(require('./routes/authentification'))
app.use('/links',require('./routes/links'))


//public
app.use(express.static(path.join(__dirname,'public')))//establecer carpeta de public



//start server
server.listen(app.get('port'), () => { console.log("server port",app.get('port')) });




