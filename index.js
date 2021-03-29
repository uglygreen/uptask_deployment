const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session  = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//const expressValidator = require('express-validator');
//IMPORTAR LAS VARIABLES
require('dotenv').config({ path: 'variables.env'})
//helpers con algunas funciones
const helpers = require('./helpers');

//crear la conexion a la BD
const db = require('./config/db');

//importar el modelo
require('./model/Proyectos');
require('./model/Tareas');
require('./model/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))

//crear una app de express
const app = express();

//donde cargar archivos estaticos
app.use(express.static('public'));

// habilitar pug
app.set('view engine', 'pug');
 
//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//agregamos express validator a toda la aplicacion
//app.use(expressValidator());



// añadir carpeta de vistas
app.set('views', path.join(__dirname, './views'));

//agregar flashh message
app.use(flash());

app.use(cookieParser());

//sessiones nos permiten navegar entre distintas paginas sin olvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar var dump a la apliccion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


app.use('/', routes());

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () =>{
    console.log('El servidor esta Listo!')
});
