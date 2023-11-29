const Database = require('../Database/db');


exports.createUsuario = (req, res) =>{
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
            if(error){
                console.log(error);
            }else{
                res.redirect('/Views/gestionUsuarios');
            }
        });
}


