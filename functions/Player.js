/**
 * @author github.com/randomdevlol / memes#2030
*/

const config = require('../config.json')
const database = require('../Database');
const accountsTable = config.table_accounts;

const petFunctions = require('./Pets');

let functions = {};

functions.getClient = function (uuid, name, callback) {
    database.query("SELECT id, name, rank, rankExpire, rankPerm, lastLogin, gems, coins, donorRank FROM `" + accountsTable + "`.`accounts` WHERE `uuid`='" + uuid + "' LIMIT 1", (err, result) => {
        if (err)
            throw err;

        if (result.length == 0) {
            if (name != null) {
                return this.createAccount(uuid, name, (response) => {
                    callback(JSON.stringify(response));
                });
            } else {
                return callback("{}");
            }
        }

        const data = {};
        data.AccountId = result[0].id;
        data.Name = result[0].name;
        data.Rank = result[0].rank;
        data.RankExpire = result[0].rankExpire;
        data.RankPerm = result[0].rankPerm == "1" ? true : false;
        data.LastLogin = result[0].lastLogin;
        data.EconomyBalance = 100;
        data.LastLogin = parseInt(result[0].lastLogin);
        data.Time = 0;

        data.DonorToken = {};
        data.DonorToken.Gems = result[0].gems;
        data.DonorToken.Coins = result[0].coins;
        data.DonorToken.Donated = result[0].donorRank == null || result[0].donorRank == "" ? false : true;

        this.getPunishments(data.Name, (response) => {
            data.Punishments = response;

            this.getPurchases(data.AccountId, (known, unknown) => {
                data.DonorToken.UnknownSalesPackages = unknown;
                data.DonorToken.SalesPackages = known;

                this.getCustomBuilds(data.Name, (builds) => {
                    data.DonorToken.CustomBuilds = builds;
                    if (process.env.STAGE == "DEVELOPMENT")
                        console.log("BUILD DEBUG: " + JSON.stringify(builds));

                    // if (process.env.STAGE == "DEVELOPMENT") {
                    //     petFunctions.getPlayerPets(data.Name, (pets) => {
                    //         data.DonorToken.Pets = pets;
                    //         data.DonorToken.PetNameTagCount = 2;

                    //         data.DonorToken.Transactions = [];
                    //         data.DonorToken.CoinRewards = [];

                    //         callback(JSON.stringify(data));
                    //     })
                    // } else {
                    data.DonorToken.Pets = [];
                    data.DonorToken.PetNameTagCount = 2;

                    data.DonorToken.Transactions = [];
                    data.DonorToken.CoinRewards = [];

                    callback(JSON.stringify(data));
                    // }
                })
            })
        })
    });
}

functions.createAccount = function (uuid, name, callback) {
    database.query("INSERT INTO `" + accountsTable + "`.`accounts` (uuid,name,gems,gold,coins,rank) VALUES ('" + uuid + "', '" + name + ", 5000, 50, 5000, null, ALL, null, null, null, 0')", (err, result) => {
        //todo fix why we need this
        database.query("SELECT `id` FROM `" + accountsTable + "`.`accounts` WHERE `uuid`='" + uuid + "'", (err, result) => {
            if (err)
                throw err;

            callback({
                "AccountId": result[0].id,
                "Name": name,
                "Rank": "ALL",
                "RankPerm": "null",
                "RankExpire": "",
                "EconomyBalance": 100,
                "LastLogin": "",
                "DonorToken": {
                    "Gems": 5000,
                    "Donated": false,
                    "SalesPackages": [],
                    "UnknownSalesPackages": [],
                    "Transactions": [],
                    "CoinRewards": [],
                    "Coins": 5000,
                    "CustomBuilds": [],
                    "Pets": []
                },
                "Punishments": []
            });
        })
    })
}

functions.getPunishments = function (name, callback) {
    database.query("SELECT * FROM `" + accountsTable + "`.`accountpunishments` WHERE `target`='" + name + "'", (err, results) => {
        if (err)
            throw err;

        if (results.length == 0) {
            return callback([]);
        }

        let punishments = [];

        results.forEach((result, index) => {
            punishments.push({
                "PunishmentId": result.id,
                "Admin": result.admin,
                "Time": parseInt(result.time),
                "Sentence": result.sentence,
                "Category": result.category,
                "Reason": result.reason,
                "Severity": result.severity,
                "Duration": result.duration,
                "Removed": null,
                "RemoveAdmin": null,
                "RemoveReason": null,
                "Active": true,
            });

            if (++index == results.length) {
                callback(punishments);
            }
        })
    })
}

functions.getPurchases = function (id, callback) {
    database.query("SELECT * FROM `" + accountsTable + "`.`accountpurchases` WHERE `accountId`=" + id, (err, results) => {
        if (err)
            throw err;

        if (results.length == 0) {
            return callback([], []);
        }

        let known = [];
        let unknown = [];

        results.forEach((result, index) => {
            if (result.known == 1)
                known.push(result.salesPackageId)
            else
                unknown.push(result.salesPackageName)

            if (++index == results.length) {
                callback(known, unknown);
            }
        });
    })
}

functions.reward = function (type, name, source, amount, callback) {
    const transactionsTable = "account" + type + "transactions";
    database.query("SELECT id FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
        let id = result[0].id;
        database.query("UPDATE `" + accountsTable + "`.`accounts` SET `" + (type + "s") + "`=`" + (type + "s") + "`+" + amount + " WHERE `name`='" + name + "'", (err, result) => {
            if (err)
                throw err;

            var reason = "";
            if (source == null) {
                reason = "Given";
            } else {
                reason = "Given by " + source;
            }

            database.query("INSERT INTO `" + accountsTable + "`.`" + transactionsTable + "` (accountId, reason, " + (type + "s") + ") VALUES (" + id + ", '" + reason + "', " + amount + ")", (err, result) => {
                if (err)
                    throw err;
                callback("true")
            });
        });
    });
}

functions.getTasks = function (callback) {
    database.query("SELECT * FROM `" + accountsTable + "`.`accounttasks`", (err, results) => {
        if (err)
            throw err;
        let response = [];

        results.forEach((result, index) => {
            let task = {};
            task.Id = result.taskId

            database.query("SELECT uuid FROM `" + accountsTable + "`.`accounts` WHERE `id`=" + result.accountId, (err, result) => {
                if (err)
                    throw err;
                task.UUID = result[0].uuid;

                database.query("SELECT name FROM `" + accountsTable + "`.`tasks` WHERE `id`=" + result.taskId, (err, result) => {
                    if (err)
                        throw err;
                    task.Task = result[0].name;
                    response.push(task);

                    if (++index == results.length) {
                        callback(response);
                    }
                })
            })
        })
    });
}

functions.getMatches = function (name, callback) {
    database.query("SELECT name FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
        if (err)
            throw err;

        if (result.length == 0) {
            callback([]);
        }

        result.forEach((result, index) => {
            if (result.name == name) {
                callback([`${result.name}`]);
                return;
            }

            if (++index == result.length) {
                callback([]);
            }
        })
    })
}

/*
[
    {
        CustomBuildNumber: custombuildnumber
        PvpClass: pvpclass,
        SwordSkill: swordSkill,
        SwordSkillLevel: swordskilllevel
        AxeSkill: axeskill,
        AxeSkillLevel: axeskilllevel,
        BowSkill: bowSkill,
        BowSkillLevel: bowSkillLevel,
        ClassPassiveASkill: classpassiveaskill,
        ClassPassiveASkillLevel: classpassiveaskilllevel,
        ClassPassiveBSkill: classpassivebskill,
        ClassPassiveBSkillLevel: classpassivebskilllevel,
        GlobalPassiveSkill: globalpassiveskill,
        GlobalPassiveSkillLevel: globalpassiveskilllevel,
        Slots: [
            Name: name,
            Material: material,
            Amount: amount
        ]
    }
]
*/
functions.getCustomBuilds = (name, callback) => {
    let response = [];
    if (process.env.STAGE != "DEVELOPMENT") {
        return callback(response);
    }

    database.query("SELECT * FROM `" + accountsTable + "`.`accountcustombuilds` WHERE `playerName`='" + name + "' AND `active`=1", (err, results) => {
        if (err)
            throw err;

        if (results.length == 0) {
            console.log('return 1');
            callback(response);
        }

        results.forEach((result, index) => {
            console.log('foreach 1');

            let build = {};

            build.CustomBuildId = result.id;
            build.CustomBuildNumber = result.number;
            build.PvpClass = result.pvpClass;

            build.SwordSkill = result.swordSkill || "";
            build.SwordSkillLevel = result.SwordSkillLevel;

            build.AxeSkill = result.axeSkill || "";
            build.AxeSkillLevel = result.axeSkillLevel;

            build.BowSkill = result.bowSkill || "";
            build.BowSkillLevel = result.bowSkillLevel;

            build.ClassPassiveASkill = result.classPassiveASkill || "";
            build.ClassPassiveASkillLevel = result.classPassiveASkillLevel;

            build.ClassPassiveBSkill = result.classPassiveBSkill || "";
            build.ClassPassiveBSkillLevel = result.classPassiveBSkillLevel;

            build.GlobalPassiveSkill = result.globalPassiveSkill || "";
            build.GlobalPassiveSkillLevel = result.globalPassiveSkillLevel;

            build.Slots = [];
            database.query("SELECT * FROM `" + accountsTable + "`.`classslots` WHERE `buildId`=" + result.id, (err, _results) => {
                if (err)
                    throw err;

                if (_results.length == 0 && ++index == results.length) {
                    console.log('return 2');
                    response.push(build);
                    callback(response);
                }

                _results.forEach((result, _index) => {
                    console.log('foreach 2');

                    let slot = {};
                    slot.Name = result.name;
                    slot.Material = result.material;
                    slot.Amount = result.amount;

                    build.Slots.push(slot);
                    response.push(build);

                    if (++_index == _results.length && ++index == results.length) {
                        console.log('return 3');
                        callback(response);
                    }
                })
            })
        });
    })
}

// i am so sorry to anyone reading this code
functions.saveCustomBuild = (json, callback) => {
    if (process.env.STAGE != "DEVELOPMENT") {
        return callback();
    }

    let {
        CustomBuildId,
        PlayerName,
        Active,
        CustomBuildNumber,
        PvpClass,
        SwordSkill,
        SwordSkillLevel,
        AxeSkill,
        AxeSkillLevel,
        BowSkill,
        BowSkillLevel,
        ClassPassiveASkill,
        ClassPassiveASkillLevel,
        ClassPassiveBSkill,
        ClassPassiveBSkillLevel,
        GlobalPassiveSkill,
        GlobalPassiveSkillLevel,
        Slots
    } = json;

    console.log(JSON.stringify(json));

    database.query("SELECT `pvpClass` FROM `" + accountsTable + "`.`accountcustombuilds` WHERE `playerName`='" + PlayerName + "' AND `pvpClass`='" + PvpClass + "'", (err, result) => {
        if (err)
            throw err;

        if (result.length == 0) {
            run();
        } else {
            database.query("DELETE FROM `" + accountsTable + "`.`accountcustombuilds` WHERE `playerName`='" + PlayerName + "' AND `pvpClass`='" + PvpClass + "'", (err, result) => {
                if (err)
                    throw err;
                run();
            })
        }

        function run() {
            let indexes = "playerName,active,number,pvpClass";
            let values = `'${PlayerName}',${Active ? 1 : 0},${CustomBuildNumber},'${PvpClass}'`;

            if (SwordSkill != '') {
                if (indexes.length != 0)
                    indexes += ",";
                if (values.length != 0)
                    values += ",";
                indexes += "swordSkill, swordSkillLevel";
                values += `'${SwordSkill}',${SwordSkillLevel}`;
            }
            if (AxeSkill != '') {
                if (indexes.length != 0)
                    indexes += ",";
                if (values.length != 0)
                    values += ",";
                indexes += "axeSkill, axeSkillLevel";
                values += `'${AxeSkill}',${AxeSkillLevel}`;
            }
            if (BowSkill != '') {
                if (indexes.length != 0)
                    indexes += ",";
                if (values.length != 0)
                    values += ",";
                indexes += "bowSkill, bowSkillLevel";
                values += `'${BowSkill}',${BowSkillLevel}`;
            }
            if (ClassPassiveASkill != '') {
                if (indexes.length != 0)
                    indexes += ",";
                if (values.length != 0)
                    values += ",";
                indexes += "classPassiveASkill, classPassiveASkillLevel";
                values += `'${ClassPassiveASkill}',${ClassPassiveASkillLevel}`;
            }
            if (ClassPassiveBSkill != '') {
                if (indexes.length != 0)
                    indexes += ",";
                if (values.length != 0)
                    values += ",";
                indexes += "classPassiveBSkill, classPassiveBSkillLevel";
                values += `'${ClassPassiveBSkill}',${ClassPassiveBSkillLevel}`;
            }
            if (GlobalPassiveSkill != '') {
                if (indexes.length != 0)
                    indexes += ",";
                if (values.length != 0)
                    values += ",";
                indexes += "globalPassiveSkill, globalPassiveSkillLevel";
                values += `'${GlobalPassiveSkill}',${GlobalPassiveSkillLevel}`;
            }

            let updateString = "INSERT INTO `" + accountsTable + "`.`accountcustombuilds` (" + indexes + ") VALUES(" + values + ")";

            console.log(updateString);

            database.query(updateString, (err, result) => {
                if (err)
                    throw err;

                Slots.forEach((slot, index) => {
                    let {
                        Name,
                        Material,
                        Amount
                    } = slot;

                    database.query("SELECT `buildId` FROM `" + accountsTable + "`.`classslots` WHERE `buildId`=" + CustomBuildId + " AND `name`='" + Name + "'", (err, result) => {
                        if (err)
                            throw err;
                        if (result.length != 0) {
                            database.query("DELETE FROM `" + accountsTable + "`.`classslots` WHERE `buildId`=" + CustomBuildId + " AND `name`='" + Name + "'", (err, result) => {
                                if (err)
                                    throw err;
                                run();
                            })
                        } else {
                            run();
                        }
                    })

                    function run() {
                        updateString = "INSERT INTO `" + accountsTable + "`.`classslots` (buildId, name, material, amount) VALUES (" + CustomBuildId + ", '" + Name + "', '" + Material + "', " + Amount + ")"
                        database.query(updateString, (err, result) => {
                            if (err)
                                throw err;

                            if (++index == Slots.length) {
                                callback();
                            }
                        })
                    }
                })
            })
        }
    })

}

module.exports = functions;