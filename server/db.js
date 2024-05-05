const mysql = require('mysql2');

const db = mysql.createConnection({
    connectionLimit: 10,
    host: 'database-2.c9uq6aysoj0x.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'rendog123',
    database: 'secure-me'
});

module.exports = db;

