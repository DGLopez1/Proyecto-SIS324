
const express = require("express");
const router = express.Router();

const Database = require('./Database/db');


//? ROUTE FOR HOME PAGE
router.get('/', (req, res) =>{

    res.render('inicio');
});


router.get('/Views/login', (req, res) => {
    res.render('login');
});



router.get('/medicos', (req, res) =>{

    //? PARA MOSTRAR USUARIOS
    var sql = "SELECT m.*, e.nombre AS nombre_especialidad FROM medicos m LEFT JOIN especialidad e ON m.id_especialidad = e.id";
    Database.query(sql, (error, results) => {

        if(error){
            throw error;
        }else{
            // res.send(results);  
            res.render('medicos', { listaMedicos: results });
        }
    });
});


module.exports = router;