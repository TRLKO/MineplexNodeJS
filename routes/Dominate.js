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