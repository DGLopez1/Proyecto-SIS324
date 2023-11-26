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