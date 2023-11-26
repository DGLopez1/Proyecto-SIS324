
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



//? PARA MOSTRAR MEDICOS
router.get('/medicos', (req, res) =>{
   var datos = req.query.dato;
//    var id = parseInt(datos);

    var sql = "SELECT m.*, e.nombre AS nombre_especialidad FROM medicos m LEFT JOIN especialidad e ON m.id_especialidad = e.id";

    if(datos){
        // sql += " WHERE m.nombre LIKE '%" + datos + "%' OR m.id=" + id;
        sql += " WHERE m.nombre LIKE '%" + datos + "%' OR m.apellido LIKE '%" + datos + "%' OR m.email LIKE '%" + datos + "%' OR e.nombre LIKE '%" + datos + "%'";
    }

    Database.query(sql, (error, results) => {

        if(error){
            throw error;
        }else{  
            if(req.xhr){
                res.render('medicos-fragmento', {listaMedicos: results}, (err, html)=>{
                    if (err) {
                        throw err;
                    } else {
                        res.send(html);
                    }
                });
            }else{
                res.render('medicos', {listaMedicos: results});
            }
        }
    });
});



module.exports = router;