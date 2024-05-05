const mysql = require('mysql2');

const db = mysql.createConnection({
    connectionLimit: 10,
    host: 'myhost',
    user: 'admin',
    password: 'mypassword',
    database: 'secure-me'
});

module.exports = db;

