/**
 * @author github.com/randomdevlol / memes#2030
*/

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// i don't wanna talk about "[]" okay just leave it be kthx
router.post('/GetSkills', jsonParser, (req, res) => {
    res.send("[]");
})

router.post('/GetItems', jsonParser, (req, res) => {
    res.send("[]");
})

router.post('/GetClasses', jsonParser, (req, res) => {
    res.send("[]");
})

module.exports = router;