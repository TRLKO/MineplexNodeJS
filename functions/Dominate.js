const config = require('../config.json')
const database = require('../Database');
const accountsTable = config.table_accounts;

let functions = {};

functions.createSkill = function (json, callback) {
    database.query("SELECT `id` FROM `" + accountsTable + "`.`transactions` WHERE `name`='" + json.Name + "'", (err, result) => {
        if (err)
            throw err;

        function makeSkill(id) {
            console.log(JSON.stringify(json));
            let free = json.SalesPackage.Free ? 1 : 0;
            database.query("INSERT INTO `" + accountsTable + "`.`skills` (name,gameSalesPackageId,gems,free,level) VALUES ('" + json.Name + "', " + id + ", " + json.SalesPackage.Gems + ", " + free + ", " + json.Level + ")", (err, result) => {
                if (err)
                    throw err;
                console.log(json.Name, json.Level);
                json.SkillId = result.insertId;
                console.log(json.SkillId);
                callback(json);
            })
        }

        if (result[0] == undefined || result[0] == null) {
            database.query("INSERT INTO `" + accountsTable + "`.`transactions` (name) VALUES ('" + json.Name + "')", (err, result) => {
                if (err)
                    throw err;

                makeSkill(result.insertId);
            })
        } else {
            makeSkill(result[0].id);
        }
    })
}

functions.getSkills = function (json, callback) {
    let skills = [];
    let i = 0;

    for (var _skill of Object.keys(json)) {
        let skill = json[_skill];
        database.query("SELECT * FROM `" + accountsTable + "`.`skills` WHERE `name`='" + skill.Name + "' LIMIT 1", (err, result) => {
            if (err)
                throw err;

            if (result.length == 0) {
                this.createSkill(skill, (response) => {
                    skills.push(response);
                });

                if ((i + 1) == Object.keys(json).length) {
                    callback(skills);
                } else {
                    i++;
                }

            } else {
                let skill = {};
                skill.SkillId = result[0].id;
                skill.Name = result[0].name;
                skill.Level = result[0].level;

                skill.SalesPackage = {};
                skill.SalesPackage.Gems = result[0].gems;
                skill.SalesPackage.Free = result[0].free == "1" ? true : false;
                skill.SalesPackage.GameSalesPackageId = result[0].gameSalesPackageId;

                skills.push(skill);

                if ((i + 1) == Object.keys(json).length) {
                    callback(skills);
                } else {
                    i++;
                }
            }
        })
    }
}

module.exports = functions;

/**
[{"SkillId":0,"Name":"Swordsmanship","Level":1,"SalesPackage":{"Gems":2000,"Free":false}}]
 */