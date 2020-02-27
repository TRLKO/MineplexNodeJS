/**
 * @author github.com/randomdevlol / memes#2030
*/

const mysql = require('mysql');
const config = require('./config.json');

const database = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password
});
database.connect(err => {
    if (err)
        throw err;
    console.log("Connected to database.")
});

module.exports = database;