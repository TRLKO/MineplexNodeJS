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

const accountsTable = config.table_accounts;

// Player tables
database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`accountpurchases` (`id` INT(11) NOT NULL AUTO_INCREMENT, `accountId` INT(11) NOT NULL , `salesPackageName` VARCHAR(30) NULL , `salesPackageId` INT(11) NULL , `cost` INT(11) NULL , `usingCredits` INT(1) NULL , `source` VARCHAR(30) NULL , `premium` INT(1) NULL , `coinPurchase` INT(1) NULL , `known` INT(1) NOT NULL, PRIMARY KEY(`id`), KEY(`accountId`), FOREIGN KEY(`accountId`) REFERENCES `accounts`(`id`));", (err, result) => {
    if (err)
        throw err;
});

module.exports = database;