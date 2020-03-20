/**
 * @author github.com/randomdevlol / memes#2030
*/

const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const config = require('../config.json');
const database = require('../Database');
const accountsTable = config.table_accounts;

/*
    /MineKart/GetKartItems
*/
router.post('/GetKartItems', jsonParser, (req, res) => {
    res.end(JSON.stringify(req.body));
})

module.exports = router;