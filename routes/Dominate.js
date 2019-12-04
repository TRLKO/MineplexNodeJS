const express = require('express');
const router = express.Router();
const config = require('../config.json')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const rawParser = bodyParser.text();

const database = require('../Database');

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