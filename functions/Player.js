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

                data.DonorToken.CustomBuilds = builds;

                data.DonorToken.Pets = [];
                data.DonorToken.PetNameTagCount = 2;

                data.DonorToken.Transactions = [];
                data.DonorToken.CoinRewards = [];

                callback(JSON.stringify(data));
            })
        })
    });
}

functions.createAccount = function (uuid, name, callback) {
    database.query("INSERT INTO `" + accountsTable + "`.`accounts` (uuid,name,gems,gold,coins,rank) VALUES ('" + uuid + "', '" + name + "', 5000, 50, 5000, 'ALL')", (err, result) => {
        if (err)
            throw err;
        
        callback({
            "AccountId": result.insertId,
            "Name": name,
            "Rank": "ALL",
            "RankPerm": "null",
            "RankExpire": "null",
            "EconomyBalance": 100,
            "LastLogin": Math.ceil(Date.now() / 1000),
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

module.exports = functions;