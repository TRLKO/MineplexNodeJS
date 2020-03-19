/**
 * @author github.com/randomdevlol / memes#2030
*/

const express = require('express');
const router = express.Router();
const config = require('../config.json')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../Database');
const accountsTable = config.table_accounts;

const functions = require('../functions/Dominate');

database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`skills`(`id` INT(11) NOT NULL AUTO_INCREMENT,`name` VARCHAR(100) NOT NULL,`gameSalesPackageId` INT(11) NOT NULL,`gems` INT(11) NOT NULL,`free` INT(1) NOT NULL,`level` INT(12) NOT NULL, PRIMARY KEY(`id`),FOREIGN KEY(`gameSalesPackageId`) REFERENCES `transactions`(`id`));", (err, result) => {
    if (err)
        throw err;
});

database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`classes`(`id` INT(11) NOT NULL AUTO_INCREMENT, `name` VARCHAR(100) NOT NULL, PRIMARY KEY(`id`));", (err, result) => {
    if (err)
        throw err;
});

database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`accountcustombuilds`(`id` INT(24) NOT NULL AUTO_INCREMENT, `playerName` VARCHAR(20) NOT NULL, `pvpClass` VARCHAR(100) NOT NULL, `number` INT(100) NOT NULL, `active` INT(1) NOT NULL, `swordSkill` VARCHAR(100) NULL, `swordSkillLevel` INT(100) NULL, `axeSkill` VARCHAR(100) NULL, `axeSkillLevel` INT(100) NULL, `bowSkill` VARCHAR(100) NULL, `bowSkillLevel` INT(100) NULL, `classPassiveASkill` VARCHAR(100) NULL, `classPassiveASkillLevel` INT(100) NULL, `classPassiveBSkill` VARCHAR(100) NULL, `classPassiveBSkillLevel` INT(100) NULL, `globalPassiveSkill` VARCHAR(100) NULL, `globalPassiveSkillLevel` INT(100) NULL, PRIMARY KEY(`id`));", (err, result) => {
    if (err)
        throw err;
});

database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`classslots`(`buildId` INT(24) NOT NULL,`name` VARCHAR(100) NOT NULL,`material` VARCHAR(30) NOT NULL,`amount` INT(24) NOT NULL);", (err, result) => {
    if (err)
        throw err;
})

/**
 *CREATE TABLE IF NOT EXISTS `buildslots`(
	`playerName` VARCHAR(20) NOT NULL,
    `pvpClass` VARCHAR(100) NOT NULL,
    `buildName` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `material` VARCHAR(30) NOT NULL,
    `amount` INT(24) NOT NULL
);
 */

router.post('/GetSkills', jsonParser, (req, res) => {
    functions.getSkills(req.body, (response) => {
        res.send(JSON.stringify(response));
    });
})

router.post('/GetItems', jsonParser, (req, res) => {
    functions.getItems(req.body, (response) => {
        res.end(JSON.stringify(response));
    })
})

router.post('/GetClasses', jsonParser, (req, res) => {
    functions.getClasses(req.body, (response) => {
        res.end(JSON.stringify(response));
    })
})

module.exports = router;