// Invocamos a dotenv para guardar variables de entorno - Login
const dotenv = require('dotenv').config({ path: './env/.env' });

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Configuración de bodyParser para parsear solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas
app.use('/', require('./router'));

// Motor de plantilla
app.set('view engine', 'ejs');

// Configuración de express para parsear solicitudes JSON y URL codificadas
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Directorios estáticos
app.use('/resources', express.static('Public'));
app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/Views'));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/env'));

// Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

// Variables de sesión
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Invocamos al módulo de conexión a la DB
const Database = require('./Database/db');

app.listen(5000, () => {
  console.log("Servidor respondiendo en https://localhost:5000");
});

