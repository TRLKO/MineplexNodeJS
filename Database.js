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

// Player tables
database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`accountpurchases` (`id` INT(11) NOT NULL AUTO_INCREMENT, `accountId` INT(11) NOT NULL , `salesPackageName` VARCHAR(30) NULL , `salesPackageId` INT(11) NULL , `cost` INT(11) NULL , `usingCredits` INT(1) NULL , `source` VARCHAR(30) NULL , `premium` INT(1) NULL , `coinPurchase` INT(1) NULL , `known` INT(1) NOT NULL, PRIMARY KEY(`id`), KEY(`accountId`), FOREIGN KEY(`accountId`) REFERENCES `accounts`(`id`));", (err, result) => {
    if (err)
        throw err;
});

// Dominate tables
database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`skills`(`id` INT(11) NOT NULL AUTO_INCREMENT,`name` VARCHAR(100) NOT NULL,`gameSalesPackageId` INT(11) NOT NULL,`gems` INT(11) NOT NULL,`free` INT(1) NOT NULL,`level` INT(12) NOT NULL, PRIMARY KEY(`id`),FOREIGN KEY(`gameSalesPackageId`) REFERENCES `transactions`(`id`));", (err, result) => {
    if (err)
        throw err;
});
database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`classes`(`id` INT(11) NOT NULL AUTO_INCREMENT, `name` VARCHAR(100) NOT NULL, PRIMARY KEY(`id`));", (err, result) => {
    if (err)
        throw err;
});
if (process.env.STAGE == "DEVELOPMENT") {
    // still in development so I wouldn't really recommend you use these tables
    database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`accountcustombuilds`(`id` INT(24) NOT NULL AUTO_INCREMENT, `playerName` VARCHAR(20) NOT NULL, `pvpClass` VARCHAR(100) NOT NULL, `number` INT(100) NOT NULL, `active` INT(1) NOT NULL, `swordSkill` VARCHAR(100) NULL, `swordSkillLevel` INT(100) NULL, `axeSkill` VARCHAR(100) NULL, `axeSkillLevel` INT(100) NULL, `bowSkill` VARCHAR(100) NULL, `bowSkillLevel` INT(100) NULL, `classPassiveASkill` VARCHAR(100) NULL, `classPassiveASkillLevel` INT(100) NULL, `classPassiveBSkill` VARCHAR(100) NULL, `classPassiveBSkillLevel` INT(100) NULL, `globalPassiveSkill` VARCHAR(100) NULL, `globalPassiveSkillLevel` INT(100) NULL, PRIMARY KEY(`id`));", (err, result) => {
        if (err)
            throw err;
    });
    database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`classslots`(`buildId` INT(24) NOT NULL,`name` VARCHAR(100) NOT NULL,`material` VARCHAR(30) NOT NULL,`amount` INT(24) NOT NULL);", (err, result) => {
        if (err)
            throw err;
    })
}

module.exports = database;