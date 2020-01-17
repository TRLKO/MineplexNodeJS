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

/**
 * @todo
 *  - get the skill id
 *  - insert the skill if it's not already there
 *  - get the salespackageid
 *  - insert & get the salespackageid if it's not there
 *  - return
 */

functions.getSkills = function (json, callback) {
    let skills = [];
    new Promise((resolve, reject) => {
        for (var i = 0; i < json.length; i++) {
            let skill = json[i];
            database.query("SELECT * FROM `" + accountsTable + "`.`skills` WHERE `name`='" + json.Name + "'", (err, result) => {
                if (err)
                    throw err;
                if (result[0] == undefined || result[0] == null) {
                    this.createSkill(skill, (response) => {
                        skills.push(response);
                        console.log("pushing")
                    });
                } else {
                    let skill = {};
                    skill.SkillId = result[0].SkillId;
                    skill.Name = result[0].Name;
                    skill.Level = result[0].Level;

                    skill.SalesPackage = {};
                    skill.SalesPackage.Gems = result[0].Gems;
                    skill.SalesPackage.Free = result[0].Free;

                    skills.push(skill);
                }
                console.log("nightmare");
            })
            if (i++ == json.length || i == json.length) {
                resolve();
            }
        }

        // resolve();
        // console.log(skills);
        // console.log("returning")
        // return skills;
    }).then(() => {
        console.log("returning")
        return skills;
    })
}

module.exports = functions;

/**
[{"SkillId":0,"Name":"Swordsmanship","Level":1,"SalesPackage":{"Gems":2000,"Free":false}}]
 */