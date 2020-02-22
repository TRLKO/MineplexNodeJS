const express = require('express');
const router = express.Router();
const config = require('../config.json')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const rawParser = bodyParser.text();

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
})

router.post('/GetSkills', jsonParser, (req, res) => {
    functions.getSkills(req.body, (response) => {
        res.send(JSON.stringify(response));
    });
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

    functions.getItems(req.body, (response) => {
        res.end(JSON.stringify(response));
    })
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