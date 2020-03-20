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
    /Fishing/GetFishingAllTimeHigh
*/
router.post('/GetFishingAllTimeHigh', jsonParser, (req, res) => {
    res.end(JSON.stringify(req.body));
});

/*
    /Fishing/GetFishingDayHigh
*/
router.post('/GetFishingDayHigh', jsonParser, (req, res) => {
    res.end(JSON.stringify(req.body));
});

/*
    /Fishing/SaveFishingAllTimeHigh
*/
router.post('/SaveFishingAllTimeHigh', jsonParser, (req, res) => {
    let {
        Name,
        Size,
        Catcher
    } = req.body;

    res.end("okay");
});

/*
    /Fishing/SaveFishingDayHigh
*/
router.post('/SaveFishingDayHigh', jsonParser, (req, res) => {
    let {
        Name,
        Size,
        Catcher
    } = req.body;

    res.end("okay");
});

/*
    /Fishing/SaveFishingScore
*/
router.post('/SaveFishingScore', jsonParser, (req, res) => {
    let {
        Name,
        Size,
        Catcher
    } = req.body;

    res.end("okay");
});

/*
    /Fishing/ClearDailyFishingScores
*/
router.post('/ClearDailyFishingScores', jsonParser, (req, res) => {
    res.end("okay");
});

module.exports = router;