/**
 * @author github.com/randomdevlol / memes#2030
 * @note to anyone reading this code, i am so very sorry
 */

const database = require('../Database');
const config = require('../config.json')
const accountsTable = config.table_accounts;

let functions = {};

functions.getPlayerPets = (name, callback) => {
    database.query("SELECT * FROM `" + accountsTable + "`.`playerpets` WHERE `name`='" + name + "'", (err, results) => {
        if (err)
            throw err;

        let pets = [];

        if (results.length == 0) {
            return callback(pets);
        }

        results.forEach(result => {
            pets.push({
                PetName: result.petName,
                PetType: result.petType
            });

            if (++index == results.length) {
                callback(pets);
            }
        });
    });
}



module.exports = functions;