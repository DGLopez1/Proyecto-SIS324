
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

