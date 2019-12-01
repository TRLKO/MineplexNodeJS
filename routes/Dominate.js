const express = require('express');
const router = express.Router();
const config = require('../config.json')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const rawParser = bodyParser.text();

const mysql = require('mysql');
const database = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password
});
database.connect(err => {
    if (err)
        throw err;
    console.log("Dominate Route DB Connected.")
});

/**
 * CREATE TABLE `clans` ( `id` INT(11) NOT NULL AUTO_INCREMENT , `serverId` INT NOT NULL , `name` VARCHAR(100) NOT NULL , `description` VARCHAR(140) NOT NULL , `home` VARCHAR(140) NOT NULL , `admin` BIT(64) NOT NULL , `dateCreated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `lastOnline` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `energy` INT(11) NOT NULL , `kills` INT(11) NOT NULL , `murder` INT(11) NOT NULL , `deaths` INT(11) NOT NULL , `warWins` INT(11) NOT NULL , `warLosses` INT(11) NOT NULL , PRIMARY KEY (`id`), FOREIGN KEY (`serverId`) REFRENCES `clanserver`(`id`)) ENGINE = InnoDB;
 * CREATE TABLE IF NOT EXISTS `clanenemies`(`id` INT(11) NOT NULL AUTO_INCREMENT,`clanId` INT(11) NOT NULL,`otherClanId` INT(11) NOT NULL,`initiator` BIT(64) NOT NULL,`timeFormed` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,`clanScore` INT(11) NOT NULL,`otherClanScore` INT(11) NOT NULL,`clanKills` INT(11) NOT NULL,`otherClanKills` INT(11) NOT NULL,PRIMARY KEY(`id`),FOREIGN KEY(`clanId`) REFERENCES `clans`(`id`),FOREIGN KEY(`otherClanId`) REFERENCES `clans`(`id`));
 * CREATE TABLE IF NOT EXISTS `clanmember`(`id` INT(11) NOT NULL AUTO_INCREMENT,`accountId` INT(11) NOT NULL,`clanId` INT(11) NOT NULL,`clanRole` VARCHAR(50) NOT NULL,`uuid` VARCHAR(100) NOT NULL,`name` VARCHAR(40) NOT NULL,PRIMARY KEY(`id`),FOREIGN KEY(`accountId`) REFERENCES `accounts`(`id`),FOREIGN KEY(`clanId`) REFERENCES `clans`(`id`));
 * CREATE TABLE IF NOT EXISTS `clanalliances`(`id` INT(11) NOT NULL AUTO_INCREMENT,`clanId` INT(11) NOT NULL,`otherClanId` INT(11) NOT NULL,`trusted` BIT(64) NOT NULL,PRIMARY KEY(`id`),FOREIGN KEY(`clanId`) REFERENCES `clans`(`id`),FOREIGN KEY(`otherClanId`) REFERENCES `clans`(`id`));
 * CREATE TABLE IF NOT EXISTS `clanterritory`(`id` INT(11) NOT NULL AUTO_INCREMENT,`clanId` INT(11) NOT NULL,`serverId` INT(11) NOT NULL,`chunk` VARCHAR(100) NOT NULL,`safe` BIT(64) NOT NULL,PRIMARY KEY(`id`),FOREIGN KEY(`clanId`) REFERENCES `clans`(`id`),FOREIGN KEY(`serverId`) REFERENCES `clanserver`(`id`));
 * CREATE TABLE IF NOT EXISTS `accountclan`(`id` INT(11) NOT NULL AUTO_INCREMENT,`accountId` INT(11) NOT NULL,`clanId` INT(11) NOT NULL,`clanRole` VARCHAR(50) NOT NULL,PRIMARY KEY(`id`),FOREIGN KEY(`accountId`) REFERENCES `accounts`(`id`),FOREIGN KEY(`clanId`) REFERENCES `clans`(`id`));
 * CREATE TABLE IF NOT EXISTS `clanshopitem`(`id` INT(11) NOT NULL AUTO_INCREMENT,`shopName` VARCHAR(50) NOT NULL,`shopPage` VARCHAR(50) NOT NULL,`slot` INT(3) NOT NULL,`material` VARCHAR(50) NOT NULL,`data` TINYINT NOT NULL,`lore` VARCHAR(50) NOT NULL,PRIMARY KEY(`id`));
 */

router.post('/GetSkills', (req, res) => {
    let response = [
        // {
        //     "SkillId": 0,
        //     "Name": "Skill Name",
        //     "Level": 100,
        //     "SalesPackage": {
        //         "GameSalesPackageId": 0,
        //         "Gems": 0,
        //         "Free": 0
        //     }
        // }
    ];

    res.send(response);
    res.end();
})

router.post('/GetItems', (req, res) => {
    let response = [
        // {
        //     "Name": "Item Name",
        //     "Material": "Material",
        //     "SalesPackage": {
        //         "GameSalesPackageId": 0,
        //         "Gems": 0,
        //         "Free": 0
        //     }
        // }
    ];

    res.send(response);
    res.end();
})

router.post('/GetClasses', (req, res) => {
    let response = [
        // {
        //     "PvpClassId": 0,
        //     "Name": "Name",
        //     "SalesPackage": {
        //         "GameSalesPackageId": 0,
        //         "Gems": 0,
        //         "Free": 0
        //     }
        // }
    ]

    res.send(response);
    res.end();
})

module.exports = router;