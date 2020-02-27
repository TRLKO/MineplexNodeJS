/**
 * @author github.com/randomdevlol / memes#2030
*/

const config = require('../config.json')
const database = require('../Database');
const accountsTable = config.table_accounts;

let functions = {};

functions.createAccount = function (uuid, name, callback) {
    database.query("INSERT INTO `" + accountsTable + "`.`accounts` (uuid,name,gems,gold,coins,rank) VALUES ('" + uuid + "', '" + req.body.Name + ", 5000, 50, 5000, null, ALL, null, null, null, 0')", (err, result) => {
        let responseJSON = {
            "AccountId": result.insertId,
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
        }

        callback(responseJSON);
    })
}

functions.getPunishments = function (name, callback) {
    database.query("SELECT * FROM `" + accountsTable + "`.`accountpunishments` WHERE `target`='" + name + "'", (err, results) => {
        if (err)
            throw err;

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

            i++;
        });
    })
}

functions.reward = function (type, name, source, amount, callback) {
    const transactionsTable = "account" + type + "transactions";
    database.query("SELECT id FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
        let id = result[0].id;
        database.query("UPDATE `" + accountsTable + "`.`accounts` SET `" + type + "`=`" + type + "`+" + amount + " WHERE `name`='" + name + "'", (err, result) => {
            if (err)
                throw err;

            var reason = "";
            if (source == null) {
                reason = "Given";
            } else {
                reason = "Given by " + source;
            }

            database.query("INSERT INTO `" + accountsTable + "`.`" + transactionsTable + "` (accountId, reason, gems) VALUES (" + id + ", '" + reason + "', " + amount + ")", (err, result) => {
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
        var i = 0;
        while (i < results.length) {
            let result = results[i];
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
                })
            })
            i++;
        }

        callback(response);
    });
}

functions.getMatches = function (name, callback) {
    database.query("SELECT name FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
        if (err)
            throw err;

        let names = [];

        result.forEach((result, index) => {
            if (result == name) {
                callback([`${result.name}`]);
                return;
            }

            names.push(`${result.name}`);

            if (++index == result.length) {
                callback(names);
            }
        })
    })
}

module.exports = functions;