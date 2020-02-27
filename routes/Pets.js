/**
 * @author github.com/randomdevlol / memes#2030
*/

const express = require('express');
const router = express.Router();
const config = require('../config.json');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const rawParser = bodyParser.text();

const database = require('../Database');

/*
    /Pets/GetPets
*/
router.post('/GetPets', jsonParser, (req, res) => {
    // let response = [];

    // response.push(
    //     {
    //         "Name": "PetName",
    //         "PetType": "Pet Type"
    //     }
    // );

    res.send(req.body.petTokens);
    res.end();
});

/*
    /Pets/GetPetExtras
*/
router.post('/GetPetExtras', jsonParser, (req, res) => {
    // let response = [];

    // response.push(
    //     {
    //         "Name": "PetName",
    //         "PetType": "Pet Type"
    //     }
    // );

    res.send(req.body.petTokens);
    res.end();
});

/*
    /Pets/AddPet
*/
router.post('/AddPet', jsonParser, (req, res) => {
    const name = req.body.Name;
    const petName = req.body.PetName;
    const petType = req.body.PetType;
    res.send("Success");
    res.end();
})

/*
    /Pets/RemovePet
*/
router.post('/RemovePet', jsonParser, (req, res) => {
    const name = req.body.Name;
    const petName = req.body.PetName;
    const petType = req.body.PetType;
    res.send("Success");
    res.end();
})

/*
    /Pets/UpdatePet
*/

router.post('/UpdatePet', jsonParser, (req, res) => {
    const name = req.body.Name;
    const petName = req.body.PetName;
    const petType = req.body.PetType;
    res.send("Success");
    res.end();
})

/*
    /Pets/AddPetNameTag
*/
router.post('/AddPetNameTag', rawParser, (req, res) => {
    const name = req.body.Name;
    res.send("Success");
    res.end();
});

/*
    /Pets/RemotePetNameTag
*/
router.post('/RemovePetNameTag', rawParser, (req, res) => {
    const name = req.body.Name;
    res.send("Success");
    res.end();
})


module.exports = router;