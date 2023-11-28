const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false })); // Agrega esta línea para configurar body-parser
app.use(bodyParser.json());

app.use('/', require('./router'));



// app.use(express.static('Public'));
// app.use(express.static('Views'));
app.use(express.urlencoded({extended: false}));  // para capturar los datos del formulario
app.use(express(express.json));


//invocamos a dotenv
const dotenv = require('dotenv')
dotenv.config({path: './env/.env'})

// Motor de plantilla
app.set('view engine', 'ejs');

// invocamos a bycrypt
const bcrypt = require('bcrypt');

// invocamos a express-session
const session = require('express-session');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/Views'));
app.use(express.static(__dirname + '/'));

app.listen(5000, () => {
  console.log("Servidor respondiendo en https://localhost:5000");
});

