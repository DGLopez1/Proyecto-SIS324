
const mysql = require('mysql');


const Database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_medipro',
    port: 3307
});


Database.connect((error) =>{
    if(error){
        console.error('El error de conexión es: ' + error);
        return;
    }
    console.log('Conexión exitosa');

});

module.exports = Database;