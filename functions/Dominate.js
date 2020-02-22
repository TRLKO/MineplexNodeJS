const config = require('../config.json')
const database = require('../Database');
const accountsTable = config.table_accounts;

let functions = {};

// SKILLS
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

                    if ((i + 1) == Object.keys(json).length) {
                        callback(skills);
                    } else {
                        i++;
                    }
                });
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
                json.SkillId = result.insertId;
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

// ITEMS
functions.getItems = function (json, callback) {
    let items = [];
    let i = 0;

    for (var _item of Object.keys(json)) {
        let item = json[_item];
        database.query("SELECT * FROM `" + accountsTable + "`.`skills` WHERE `name`='" + item.Name + "' LIMIT 1", (err, result) => {
            if (err)
                throw err;

            if (result.length == 0) {
                this.createSkill(item, (response) => {
                    items.push(response);

                    if ((i + 1) == Object.keys(json).length) {
                        callback(items);
                    } else {
                        i++;
                    }
                });
            } else {
                database.query("SELECT `id` FROM `" + accountsTable + "`.`transactions` WHERE `name`='" + item.Name + "'", (err, result1) => {
                    let item = {};
                    item.Name = result[0].name;
                    item.Material = json.Material;

                    skill.SalesPackage = {};
                    skill.SalesPackage.GameSalesPackageId = result1[0].id;

                    items.push(item);

                    if ((i + 1) == Object.keys(json).length) {
                        callback(items);
                    } else {
                        i++;
                    }
                })
            }
        })
    }
}

functions.createItem = function (json, callback) {
    database.query("SELECT `id` FROM `" + accountsTable + "`.`transactions` WHERE `name`='" + json.Name + "'", (err, result) => {
        if (err)
            throw err;

        function make() {
            database.query("INSERT INTO `" + accountsTable + "`.`items` (name,categoryId,rarity) VALUES ('" + json.Name + "', " + json.CategoryId + ", " + json.Rarity + ")", (err, result) => {
                if (err)
                    throw err;
                json.SkillId = result.insertId;
                callback(json);
            })
        }

        if (result[0] == undefined || result[0] == null) {
            database.query("INSERT INTO `" + accountsTable + "`.`transactions` (name) VALUES ('" + json.Name + "')", (err, result) => {
                if (err)
                    throw err;

                make();
            })
        } else {
            make();
        }
    })
}

// CLASSES
functions.getClasses = function (json, callback) {
    let classes = [];
    let i = 0;

    for (var __class of Object.keys(json)) {
        let _class = json[__class];
        database.query("SELECT * FROM `" + accountsTable + "`.`skills` WHERE `name`='" + _class.Name + "' LIMIT 1", (err, result) => {
            if (err)
                throw err;

            if (result.length == 0) {
                this.createClass(_class, (response) => {
                    classes.push(response);

                    if ((i + 1) == Object.keys(json).length) {
                        callback(classes);
                    } else {
                        i++;
                    }
                });
            } else {
                database.query("SELECT `id` FROM `" + accountsTable + "`.`transactions` WHERE `name`='" + _class.Name + "'", (err, result1) => {
                    let _class = {};
                    _class.PvpClassId = result[0].id;
                    _class.Name = result[0].name;

                    _class.SalesPackage = {};
                    _class.SalesPackage.GameSalesPackageId = result1[0].id;

                    classes.push(_class);

                    if ((i + 1) == Object.keys(json).length) {
                        callback(classes);
                    } else {
                        i++;
                    }
                })
            }
        })
    }
}

functions.createClass = function (json, callback) {
    database.query("SELECT `id` FROM `" + accountsTable + "`.`transactions` WHERE `name`='" + json.Name + "'", (err, result) => {
        if (err)
            throw err;

        function make() {
            database.query("INSERT INTO `" + accountsTable + "`.`class` (name) VALUES ('" + json.Name + "')", (err, result) => {
                if (err)
                    throw err;
                json.PvpClassId = result.insertId;
                callback(json);
            })
        }

        if (result[0] == undefined || result[0] == null) {
            database.query("INSERT INTO `" + accountsTable + "`.`transactions` (name) VALUES ('" + json.Name + "')", (err, result) => {
                if (err)
                    throw err;

                make();
            })
        } else {
            make();
        }
    })
}

module.exports = functions;

/**
[{"SkillId":0,"Name":"Swordsmanship","Level":1,"SalesPackage":{"Gems":2000,"Free":false}}]
 */