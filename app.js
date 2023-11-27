// Invocamos  a dotenv para guadar variable de entorno - Login
const dotenv = require('dotenv').config({ path: './env/.env' });
// require('dotenv').config({ path: './env/.env' });

const express = require("express");
const app = express();
app.use('/', require('./router'));


// Motor de plantilla
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(express(express.json));


// Directorio public  - para utilizar los archivos estáticos
app.use('/resources', express.static('Public'));
app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/Views'));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/env'));

// Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

// Para las variables de session
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Invocamos al modulo de conexion de la DB
const Database = require('./Database/db');

app.listen(5000, () => {
  console.log("Servidor respondiendo en https://localhost:5000");
});
