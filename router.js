
const express = require("express");
const router = express.Router();

const Database = require('./Database/db');


// Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

const session = require('express-session');
router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


//? ROUTE FOR HOME PAGE
router.get('/', (req, res) =>{

    res.render('inicio');
});


router.get('/Views/login', (req, res) => {
    res.render('login',{error: ''} );
});

router.get('/Views/gestionMedicos', (req, res) => {
    res.render('gestionMedicos', {gMedicos: 'Gestionar Medicos' });
});


router.get('/Views/gestionUsurios', (req, res) => {
    res.render('gestionUsuarios', {gUsuarios : 'Gestionar Usuarios' });
});

router.get('/Views/gestionEspecialidades', (req, res) => {
    res.render('gestionEspecialidades', {gEspecialidades : 'Gestionar Especialidades' });
});


router.get('/Views/register', (req, res)=>{
    res.render('register');
});


router.post('/Views/controllers', (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;
    if(email && password){
        Database.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, result)=>{
            if(result.length == 0 || result[0].password != password){
                res.render('login',{
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'Email o contraseña incorrectos',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 4000,
                    ruta: 'Views/login'   
                  } );
            }else{
               // req.session.cuenta= result[0].cuenta;
                res.render('controllers', {auth: '"Bienvenido   '+result[0].cuenta+'"' });
            }
        })
    }else{
        res.send('Por favor ingrese email y contraseña');
    }
})

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