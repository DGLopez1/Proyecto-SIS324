const Database = require('../Database/db');


exports.buscar = (req, res) =>{

    var dato = req.body.dato;

    var sql = "SELECT * FROM medicos WHERE nombre LIKE '%" + dato + "%'";
    Database.query(sql, (error, results) => {

        if(error){
            throw error;
        }else{
            res.render('medicos', {listaMedicos: results});
        }

    });
}


exports.createUsuario = (req, res) =>{
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const cuenta = req.body.cuenta;
    const email = req.body.email;
    const clave = req.body.password;
    const rol = req.body.rol;

    // console.log(nombre + ' - ' + cuenta);

    Database.query('INSERT INTO usuarios SET ?', {
            nombre: nombre,
            apellido: apellido,
            cuenta: cuenta,
            email: email,
            clave: clave,
            rol: rol
        }, (error, results) => {
            if(error){
                console.log(error);
            }else{
                res.redirect('/Views/gestionUsuarios');
            }
        });
}