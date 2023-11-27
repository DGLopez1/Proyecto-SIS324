
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
    res.render('login');
});

router.get('/Views/register', (req, res)=>{
    res.render('register');
});


//? AUTENTICATION
router.get('/auth', async (req, res)=>{

    var email = req.query.email;
    var password = req.query.password;
    // let passwordHaash = await bcryptjs.hash(password, 8); // Incriptada

    console.log(email);
    console.log(password);


    if(email && password){

        var sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

        Database.query(sql, [email, password], async (error, results)=>{
            if(error){
                res.render('error', { message: 'Error en la consulta a la base de datos' });
            }else{
                if(results > 0){
                    // res.render('/Views/controllers', { user: results[0] });
                    // res.render('/Views/controllers');
                    // window.open('/Views/controllers');
                    // res.redirect('/Views/controllers');
                    // req.session.user = results[0];
                    res.redirect('/Views/controllers');
                }else{
                    // res.render('login', { error: 'Credenciales incorrectas' });
                    // window.open('/Views/login', {error: 'Credenciales Incorrectas'});
                    // alert('Credenciales Incorrectas');
                    res.render('login');
                }
            }
        });
    }else {
        res.render('login', { error: 'Por favor, ingrese correo y contraseña' });
    }


    // if(email && password){

    //     var sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
    //     Database.query(sql, [email, passwordHaash], async (error, results)=>{

    //         if(results.length == 0 || !(await bcryptjs.compare(password, results[0].password))){
    //             // res.render('login', {error: true});
    //             // res.send('CREDENCIALES INCORRECTAS');
    //             res.render('login',{
    //                 alert: true,
    //                 alertTitle: "Error",
    //                 alertMessage: "Credenciales incorrectas",
    //                 alertIcon: "error",
    //                 showConfirmButton: true,
    //                 timer: false,
    //                 ruta: "login"
    //             });
    //         }else{
    //             // res.render('login', {error: false});
    //             // res.send('CREDENCIALES CORRECTAS');
    //             req.session.nombre = results[0].nombre;
    //             res.render('login',{
    //                 alert: true,
    //                 alertTitle: "Exito",
    //                 alertMessage: "Credenciales correctas",
    //                 alertIcon: "success",
    //                 showConfirmButton: true,
    //                 timer: false,
    //                 ruta: ""
    //             });
    //         }
    //     });
    // }else{
    //     // res.send('Por favor ingrese un password');
    //     res.render('login',{
    //         alert: true,
    //         alertTitle: "Advertencia",
    //         alertMessage: "Por favor ingrese un password",
    //         alertIcon: "warning",
    //         showConfirmButton: true,
    //         timer: false,
    //         ruta: "login"
    //     });
    // }
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