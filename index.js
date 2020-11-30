'use strict';
//IMPORTACIÓN DE LOS ELEMENTOS A UTILIZAR
const express = require('express');

// BODY-PARSE
const bodyParser = require('body-parser');

// CORS
const cors = require('cors');

//path para utilizar el dirname
const path = require('path');

const morgan = require('morgan');
const trabajador = require('./routes/trabajador');
const cita = require('./routes/cita');
const cliente = require('./routes/cliente');

// Para subir archivos
const multer = require('multer');
// uuid para cambiar el nombre de los archivos
const { uuid } = require('uuidv4');

// Inicializacion de espress
const app = express();

//CORS
app.use(cors({origin: '*'}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://equipo8-sap-ppi-2020.vercel.app');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// BODY-PARSE
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));


app.get('/', (req, res) => {
    res.send('Servidor barppi corriendo');
});


app.use('/api', trabajador);
app.use('/api/cliente', cliente);
app.use('/api/cita', cita);






// Esta es la parte donde se realiza la parte de subir una imagen o archivo
// Middlewares necesarios 

// multer middleware
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req,file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});

app.use(multer({storage}).single('image'));

//routes use
app.use(require('./routes/routes'));




// Configuraciones
app.set('port', process.env.PORT || 4020);

// Incializacion del servidor
app.listen(app.get('port'), () => {
    console.log('Servidor de barppi corriendo en el puerto', app.get('port'));
})