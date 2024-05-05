const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const boddParser = require('body-parser');
var cors = require('cors');

const app = express();

app.use(boddParser.json());
app.use(boddParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Connected to database');

});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

app.post('/register', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    var query = "INSERT INTO users (username, password) VALUES (?, ?)";
    var query2 = "SELECT * FROM users WHERE username = ?";

    db.query(query2,[username], (err, result) => {
        if(err){
            console.log("error");

            throw err;
        }
        if(result.length > 0){
            console.log("Username already exists");
            res.send({message: "Username already exists"});
        }
        if(result.length === 0){
            console.log("User created");
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.query(query, [username, hashedPassword], (err, result) => {
                if(err){
                    console.log("error");
                    throw err;
                }
                res.send({message: "User created"});
            });
        }
    })
});

app.post('/add', (req, res) => {
    var user_id = req.body.user_id;
    var password_name = req.body.password_name;
    var password = req.body.password;

    var query = 'INSERT INTO passwords (password_name, password) VALUES (?, ?)';
    var query2 = 'INSERT INTO relationship (userID, passwordID) VALUES (?, ?)';

    db.query(query, [password_name, password], (err, result) => {
        if(err){
            console.log("error");
            throw err;
        }
        const pass_id = result.insertId;
        db.query(query2, [user_id, pass_id], (err, result) => {
            if(err){
                console.log("error");
                throw err;
            }
        });

    });

    res.send({message: "Password added"});

});


app.post('/delete', (req, res) => {
    var password_id = req.body.password_id;
    var query = "DELETE FROM passwords WHERE id = ?";
    var query2 = "DELETE FROM relationship WHERE passwordID = ?";

    db.query(query, [password_id], (err, result) => {
        if(err){
            console.log("error");
            throw err;
        }
        db.query(query2, [password_id], (err, result) => {
            if(err){
                console.log("error");
                throw err;
            }
        });
    });

    res.send({message: "Password deleted"});
});

app.get('/getpasswords', (req, res) => {
    var user_id = req.query.user_id;
    var query = "SELECT * FROM passwords WHERE id IN (SELECT passwordID FROM relationship WHERE userID = ?)";

    db.query(query, [user_id], (err, result) => {
        if(err){
            console.log("error");
            throw err;
        }
        console.log(result);
        res.send(result);
    });
});
