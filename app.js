const express = require("express");
const app = express();
app.use('/', require('./router'));


// Motor de plantilla
app.set('view engine', 'ejs');

// app.use(express.static('Public'));
// app.use(express.static('Views'));
app.use(express.urlencoded({extended: false}));  // para capturar los datos del formulario
app.use(express(express.json));

app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/Views'));
app.use(express.static(__dirname + '/'));

app.listen(5000, () => {
  console.log("Servidor respondiendo en https://localhost:5000");
});
