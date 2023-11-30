
const express = require("express");
const router = express.Router();

const Database = require('./Database/db');


// Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

const session = require('express-session');
router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));


//? ROUTE FOR HOME PAGE
router.get('/', (req, res) => {
    console.log(req.session.usuario)
    res.render('inicio', {
        usuario: req.session.usuario
         // Pasa la sesión de usuario a la vista
    });
    
});




 router.get('/Views/login', (req, res) => {
     res.render('login',{error: ''} );
 });


router.get('/Views/register', (req, res)=>{
    res.render('register');
});




//? PARA EL LOGIN 

router.post('/Views/controllers', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    var password_medico = password.length;

    if (email && password) {

        if(password_medico >= 7){
            Database.query('SELECT * FROM medicos WHERE email = ?', [email], (error_medicos, result_medicos) => {

                if (error_medicos) {
                    console.error("Error en la consulta de médicos:", error_medicos);
                    res.status(500).send('Error en la consulta de médicos');
                    return;
                }
    
                if (result_medicos[0].telefono == password) {
    
                    console.log(result_medicos[0].telefono + password);
                    req.session.usuario = {
                        fotografia: result_medicos[0].fotografia,
                        nombre: result_medicos[0].nombre,
                        apellido: result_medicos[0].apellido,
                        telefono: result_medicos[0].telefono,
                        email: result_medicos[0].email,
                        descripcion: result_medicos[0].descripcion,
                        educacion: result_medicos[0].educacion,
                        direccion: result_medicos[0].direccion,
                        horarios: result_medicos[0].horarios,
                        id_especialidad: result_medicos[0].id_especialidad,
                        tipo: "medico",
                        id: result_medicos[0].id
                    };
                    res.redirect('/');
                } else {
                    res.render('login', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Email o contraseña incorrectos para médicos',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 4000,
                        ruta: 'Views/login'
                    });
                }
            });
        }else{

            Database.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, result) => {
                if (error) {
                    console.error("Error en la consulta de usuarios:", error);
                    res.status(500).send('Error en la consulta de usuarios');
                    return;
                }
    
                if (result.length == 0 || result[0].password != password) {
                    res.render('login', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Email o contraseña incorrectos',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 4000,
                        ruta: 'Views/login'
                    });
                } else {
                    if (result[0].rol == 'admin') {
                        res.render('controllers', { auth: '"Bienvenido   ' + result[0].nombre + '"' });
                    } else {
                        if (result[0].rol == 'usuario') {
                            if (result.length > 0) {
                                req.session.usuario = {
                                    nombre: result[0].nombre,
                                    apellido: result[0].apellido,
                                    cuenta: result[0].cuenta,
                                    email: result[0].email,
                                    password: result[0].password,
                                    rol: 'usuario',
                                    tipo: 'normal',
                                    id: result[0].id
                                };
                                res.redirect('/');
                            }
                        } 
                    }
                }
    
            });
        }
    } else {
        res.send('Por favor ingrese email y contraseña');
    }
});






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





//? PARA MOSTRAR ESPECIALIDADES

router.get('/especialidades', (req, res) => {
  
    Database.query("SELECT perfil, nombre, descripcion FROM especialidad", (error, resultado) => {
      if (error) {
        throw error;
      } else {
        res.render('especialidades', { listaEspecialidades: resultado });
      }
    });
});





//Para about
const ejs = require('ejs');
const path = require('path');
const { error } = require("console");

router.get('/about', function(req, res) {
    console.log("Accediendo a la ruta /about");
    ejs.renderFile(path.join(__dirname, 'views', 'about.ejs'), function(err, str){
        if(err){
            console.error(err);
            res.status(500).send('Server Error');
        } else {
            res.send(str);
        }
    });
});



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


//? CREAR UN NUEVO MEDICO
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




//? PARA EDITAR MEDICOS
router.get('/Views/editMedico/:id', (req, res) => {
    const userId = req.params.id;
    // Recupera la información del usuario con el ID y pasa los datos a la vista
    Database.query('SELECT * FROM medicos WHERE id = ?', [userId], (error, result) => {
        if (error) {
            console.error(error);
            res.render('error', { message: 'Error al obtener datos del usuario' });
        } else {
            res.render('editMedico', { medico: result[0] });
            // console.log(result[0]);
        }
    });
});


router.post('/editMedico/:id', (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body; // Datos actualizados del formulario

    Database.query('UPDATE medicos SET ? WHERE id = ?', [updatedData, userId], (error, result) => {
        if (error) {
            console.error(error);
            res.json({ success: false, message: 'Error al editar el usuario' });
        } else {
            res.render('controllers', {auth: 'Bienvenido' });
        }
    });
});


//? PARA EL DELETE DEL MEDICO
router.delete('/deleteMedico/:id', (req, res) => {
    const userId = req.params.id;
  
    Database.query('DELETE FROM medicos WHERE id = ?', [userId], (error, result) => {
      if (error) {
        console.error(error);
        res.json({ success: false, message: 'Error al eliminar el usuario' });
      } else {
        res.json({ success: true, message: 'Medico eliminado exitosamente' });
      }
    });
  });







//? CREAR USUARIO MEDICO O NORMAL POR EL MISMO USUARIO 
router.get('/crearusuario', (req, res) => {
    var sqlEspecialidades = "SELECT * FROM especialidad";
    
    Database.query(sqlEspecialidades, (errorEspecialidades, resultadosEspecialidades) => {
        if (errorEspecialidades) {
            throw errorEspecialidades;
        } else {
            res.render('crearusuario', { especialidades: resultadosEspecialidades });
        }
    });
});


router.post('/createUsuarioMedico', (req, res) => {
    const tipoUsuario = req.body.tipoUsuario;
    console.log(req.body);
    console.log(tipoUsuario);
    if (tipoUsuario === 'normal') {
        console.log("Creando usuario normal");
        // Crear un usuario normal
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const cuenta = req.body.cuenta;
        const email = req.body.email;
        const password = req.body.password;
        const rol = '1'

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
                //res.json({ success: true, message: 'Usuario creado exitosamente' });

                const usuarioId = results.insertId; // Obtén el ID del médico insertado

                req.session.usuario = {
                    nombre : req.body.nombre,
                    apellido : req.body.apellido,
                    cuenta : req.body.cuenta,
                    email : req.body.email,
                    password : req.body.password,
                    rol : '1',
                    tipo : tipoUsuario,
                    id: usuarioId // Usa el ID del médico insertado
                };
                res.redirect('/');
            }
        });
    } else if (tipoUsuario === 'medico') {
        // Crear un médico
        console.log("Creando usuario médico");
        const fotografia = req.body.fotografia;
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const telefono = req.body.telefono;
        const email = req.body.email;
        const descripcion = req.body.descripcion;
        const educacion = req.body.educacion;
        const direccion = req.body.direccion;
        const horarios = req.body.horarios;
        const id_especialidad = req.body.especialidad;

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
                res.json({ success: false, message: 'Error al crear el médico' });
            } else {
                const medicoId = results.insertId; // Obtén el ID del médico insertado

                req.session.usuario = {
                    fotografia: fotografia,
                    nombre: nombre,
                    apellido: apellido,
                    telefono: telefono,
                    email: email,
                    descripcion: descripcion,
                    educacion: educacion,
                    direccion: direccion,
                    horarios: horarios,
                    id_especialidad: id_especialidad,
                    tipo: tipoUsuario,
                    id: medicoId // Usa el ID del médico insertado
        };
                res.redirect('/');
            }
        });
    } else {
        res.json({ 
            success: false,
            message: 'Tipo de usuario no válido',
            tipoUsuario: tipoUsuario,
            cuerpoPeticion: req.body
          });
    }
});

// Agrega esta ruta en tu archivo de rutas
router.get('/logout', (req, res) => {
    // Destruye la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            // Redirige al usuario a la página de inicio después de cerrar sesión
            res.redirect('/');
        }
    });
});

router.get('/editarUsuario', (req, res) => {
    
    res.render('editarUsuario', { usuario: req.session.usuario });
});

router.get('/editarMedico', (req, res) => {
    
    res.render('editarMedico', { medico: req.session.usuario });
});


router.post('/editarUsuario/:id', (req, res) => {
    // Verifica si la sesión del usuario está activa
    if (!req.session.usuario) {
        return res.status(403).json({ success: false, message: 'Sesión no activa' });
    }

    const userId = req.session.usuario.id;
    const updatedData = req.body; // Datos actualizados del formulario

    Database.query('UPDATE usuarios SET ? WHERE id = ?', [updatedData, userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error al editar el usuario' });
        }

        req.session.usuario = { ...req.session.usuario, ...updatedData };
        
        // Redirige a la dirección '/' solo si la sesión está activa
        return res.redirect('/');
    });
});


router.post('/editarMedico/:id', (req, res) => {
    // Verifica si la sesión del usuario está activa
    if (!req.session.usuario) {
        return res.status(403).json({ success: false, message: 'Sesión no activa' });
    }

    const medicoId = req.params.id;
    const updatedData = req.body; // Datos actualizados del formulario

    Database.query('UPDATE medicos SET ? WHERE id = ?', [updatedData, medicoId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error al editar el médico' });
        }

        req.session.usuario = { ...req.session.usuario, ...updatedData };
        
        // Redirige a la dirección '/' solo si la sesión está activa
        return res.redirect('/');
    });
});



module.exports = router;