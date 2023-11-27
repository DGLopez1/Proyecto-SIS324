
const mysql = require('mysql');


// const Database = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'db_medipro',
//     port: 3307
// });

const Database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.PORT
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('PORT:', process.env.PORT);



Database.connect((error) =>{
    if(error){
        console.error('El error de conexión es: ' + error);
        return;
    }
    console.log('Conexión exitosa');

});

module.exports = Database;