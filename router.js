
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


router.get('/Views/register', (req, res)=>{
    res.render('register');
});


//? PARA EL LOGIN 
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
                res.render('controllers', {auth: '"Bienvenido   '+result[0].nombre+'"' });
            }
        })
    }else{
        res.send('Por favor ingrese email y contraseña');
    }
})


//? PARA LISTA DE MEDICOS
router.get('/Views/gestionMedicos', (req, res) => {
    Database.query('SELECT * FROM medicos', (error, result) => {
        if (result.length > 0) {
            res.render('gestionMedicos', { listaMedicos: result, gMedicos: 'Gestionar Medicos' });
        } else {
            res.render('gestionMedicos', { listaMedicos: [], gMedicos: 'Gestionar Medicos' });
        }
    });
});


//? PARA LISTA DE USUARIOS
router.get('/Views/gestionUsuarios', (req, res) => {
    Database.query('SELECT * FROM usuarios', (error, result) => {
        if (result.length > 0) {
            res.render('gestionUsuarios', { listaUsuarios: result, gUsuarios: 'Gestionar Usuarios' });
        } else {
            res.render('gestionUsuarios', { listaUsuarios: [], gUsuarios: 'Gestionar Usuarios' });
        }
    });
});


//? PARA LISTA DE ESPECIALIDADES
router.get('/Views/gestionEspecialidades', (req, res) => {
    Database.query('SELECT * FROM especialidad', (error, result) => {
        if (result.length > 0) {
            res.render('gestionEspecialidades', { listaEspecialidades: result, gEspecialidades: 'Gestionar Especialidades' });
        } else {
            res.render('gestionEspecialidades', { listaEspecialidades: [], gEspecialidades: 'Gestionar Especialidades' });
        }
    });
});




//? PARA MOSTRAR LA BUSQUEDA DE LOS MEDICOS
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



// const crudUser = require('./Controllers/constrolUser');
// router.post('/createUsuario', crudUser.createUsuario);

//? GESTION DE USUARIOS

// CREAR UN NUEVO USUARIO
router.post('/createUsuario', (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const cuenta = req.body.cuenta;
    const email = req.body.email;
    const password = req.body.password;
    const rol = req.body.rol;

    Database.query('INSERT INTO usuarios SET ?', {
        nombre: nombre,
        apellido: apellido,
        cuenta: cuenta,
        email: email,
        password: password,
        rol: rol
    }, (error, results) => {
        if (error) {
            console.error(error);
            res.json({ success: false, message: 'Error al crear el usuario' });
        } else {
            res.json({ success: true, message: 'Usuario creado exitosamente' });
        }
    });
});


//? ACTUALIZAR UN NUEVO USUARIO

router.get('/Views/editUsuario/:id', (req, res) => {
    const userId = req.params.id;
    // Recupera la información del usuario con el ID y pasa los datos a la vista
    Database.query('SELECT * FROM usuarios WHERE id = ?', [userId], (error, result) => {
        if (error) {
            console.error(error);
            res.render('error', { message: 'Error al obtener datos del usuario' });
        } else {
            res.render('editUser', { usuario: result[0] });
        }
    });
});

router.post('/editUsuario/:id', (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body; // Datos actualizados del formulario

    Database.query('UPDATE usuarios SET ? WHERE id = ?', [updatedData, userId], (error, result) => {
        if (error) {
            console.error(error);
            res.json({ success: false, message: 'Error al editar el usuario' });
        } else {
            res.json({ success: true, message: 'Usuario editado exitosamente' });
        }
    });
});



//? PARA EL DELETE DEL USUARIO
router.delete('/deleteUsuario/:id', (req, res) => {
    const userId = req.params.id;
  
    Database.query('DELETE FROM usuarios WHERE id = ?', [userId], (error, result) => {
      if (error) {
        console.error(error);
        res.json({ success: false, message: 'Error al eliminar el usuario' });
      } else {
        res.json({ success: true, message: 'Usuario eliminado exitosamente' });
      }
    });
  });
  





  //TODO: GESTION DE MEDICOS
  // CREAR UN NUEVO MEDICO
router.post('/createMedico', (req, res) => {
    const fotografia = req.body.fotografia;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const descripcion = req.body.descripcion;
    const educacion = req.body.educacion;
    const direccion = req.body.direccion;
    const horarios = req.body.horarios;
    const id_especialidad = req.body.id_especialidad;

    Database.query('INSERT INTO medicos SET ?', {
        fotografia: fotografia,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        email: email,
        descripcion: descripcion,
        educacion: educacion,
        direccion: direccion,
        horarios: horarios,
        id_especialidad: id_especialidad
    }, (error, results) => {
        if (error) {
            console.error(error);
            res.json({ success: false, message: 'Error al crear el usuario' });
        } else {
            res.json({ success: true, message: 'Medico creado exitosamente' });
        }
    });
});

module.exports = router;