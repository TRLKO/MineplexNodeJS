const express = require('express');
const router = express.Router();
const config = require('../config.json');

// const bodyParser = require('body-parser');
const jsonParser = express.json();
const rawParser = express.raw();

const mysql = require('mysql');
const database = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password
});
database.connect(err => {
    if (err)
        throw err;
    console.log("PlayerAccount Route DB Connected.")
});

const accountsTable = config.table_accounts;

// For purchases because there really isn't a designated table for storing them
// database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`accountPurchases` ( `accountId` INT(11) NOT NULL , `salesPackageName` VARCHAR(30) NOT NULL , `salesPackageId` INT(11) NOT NULL , `cost` INT(11) NOT NULL , `usingCredits` INT(1) NOT NULL , `source` VARCHAR(30) NOT NULL , `Premium` INT(1) NOT NULL , `CoinPurchase` INT(1) NOT NULL , `known` INT(1) NOT NULL );", (err, result) => {
//     if (err)
//         throw err;
// });

/*
    /PlayerAccount/Login
    side note- i hate this
    TODO: playerIps, adding a player to the database when they haven't joined before
*/
router.post('/Login', jsonParser, (req, res) => {
    const uuid = req.body.Uuid;
    const name = req.body.Name;
    const ip = req.body.IpAddress;

    database.query("SELECT id, name, rank, rankExpire, rankPerm, lastLogin FROM `" + accountsTable + "`.`accounts` WHERE `uuid`='" + uuid + "' LIMIT 1", (err, result) => {
        if (err)
            throw err;

        if (result[0] == undefined || result[0] == null) {
            // name 	gems 	gold 	coins 	donorRank 	rank 	rankPerm 	rankExpire 	lastLogin 	totalPlayTime 
            database.query("INSERT INTO `" + accountsTable + "`.`accounts` (uuid,name,gems,gold,coins,rank) VALUES ('" + uuid + "', '" + name + ", 5000, 50, 5000, null, ALL, null, null, null, 0')")

            let responseJSON = {
                "AccountId": id,
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

            res.send(JSON.stringify(responseJSON));
            res.end();
            return;
        }

        const id = result[0].id;
        const name = result[0].name;
        const rank = result[0].rank;
        const rankExpire = result[0].rankExpire;
        const rankPerm = result[0].rankPerm == "1" ? true : false;
        const lastLogin = result[0].lastLogin;

        database.query("SELECT gems, coins, donorRank FROM `" + accountsTable + "`.`accounts` WHERE `uuid`='" + uuid + "'", (err, result) => {
            if (err)
                throw err;

            const gems = result[0].gems;
            const coins = result[0].coins;
            let donated;
            if (result[0].donorRank == null || result[0].donorRank == "") {
                donated = false;
            } else {
                donated = true;
            }

            database.query("SELECT * FROM `" + accountsTable + "`.`accountpunishments` WHERE `target`='" + name + "'", (err, results) => {
                if (err)
                    throw err;

                let punishments = [];

                results.forEach(result => {
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
                })

                let responseJSON = {
                    "AccountId": id,
                    "Name": name,
                    "Rank": rank,
                    "RankPerm": rankPerm,
                    "RankExpire": parseInt(rankExpire),
                    "EconomyBalance": 100,
                    "LastLogin": parseInt(lastLogin),
                    "Time": 0,
                    "DonorToken": {
                        "Gems": gems,
                        "Donated": donated,
                        "SalesPackages": [],
                        "UnknownSalesPackages": [],
                        "Transactions": [],
                        "CoinRewards": [],
                        "Coins": coins,
                        "CustomBuilds": [],
                        "Pets": []
                    },
                    "Punishments": punishments
                }

                console.log(responseJSON);

                res.send(JSON.stringify(responseJSON));
                res.end();

                console.log(punishments);
            })

            // database.query("SELECT * FROM `" + accountsTable + "`.`accountPurchases` WHERE `accountId`='" + id + "'", (err, result) => {
            //     if (err)
            //         throw err;

            //     let known = [];
            //     let unknown = [];

            //     if (typeof (result[0]) != 'undefined') {
            //         if (result[0].known) {
            //             known.push(result[0].salesPackageId);
            //         } else {
            //             unknown.push(result[0].salesPackageName);
            //         }
            //     }
            // })
        })
    });
});

/*
    /PlayerAccount/GetAccount
*/
router.post('/GetAccountByUUID', jsonParser, (res, req) => {
    const uuid = req.body.Uuid;

    database.query("SELECT id, name, rank, rankExpire, lastLogin FROM `" + accountsTable + "`.`accounts` WHERE `uuid`='" + uuid + "' LIMIT 1", (err, result) => {
        if (err)
            throw err;

        var responseJSON = {
            "AccountId": result[0].id,
            "Name": result[0].name,
            "Rank": result[0].rank,
            "RankPerm": result[0].rankPerm,
            "RankExpire": parseInt(result[0].rankExpire),
            "EconomyBalance": 100,
            "LastLogin": parseInt(result[0].lastLogin)
        }

        res.send(JSON.stringify(responseJSON));
        res.end();
    });
});

/*
    /PlayerAccount/RankUpdate
*/
router.post('/RankUpdate', jsonParser, (req, res) => {
    res.send(req.body.Rank);
    res.end(req.body.Rank);
});

/*
    /PlayerAccount/GetMatches
*/
router.post('/GetMatches', rawParser, (req, res) => {
    const name = "" + "%";
    console.log(name, req.body, req.rawBody);
    database.query("SELECT name FROM `" + accountsTable + "`.`accounts` WHERE `name` LIKE '" + name + "'", (err, result) => {
        if (err)
            throw err;

        let names = [];

        result.forEach(result => {
            if (result == name.replace("%", "")) {
                res.send([result]);
                res.end();
                return;
            }
            names.push(result.name);
        })

        res.send(names);
        res.end();
    })
});

/*
    /PlayerAccount/GemReward
*/
router.post('/GemReward', jsonParser, (req, res) => {
    const source = req.body.Source;
    const name = req.body.Name;
    const amount = req.body.Amount;

    database.query("SELECT id FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
        let id = result[0].id;
        database.query("UPDATE `" + accountsTable + "`.`accounts` SET `gems`=`gems`+" + amount + " WHERE `name`='" + name + "'", (err, result) => {
            if (err)
                throw err;

            var reason = "";
            if (source == null) {
                reason = "Given";
            } else {
                reason = "Given by " + source;
            }

            database.query("INSERT INTO `" + accountsTable + "`.`accountgemtransactions` (accountId, reason, gems) VALUES (" + id + ", '" + reason + "', " + amount + ")", (err, result) => {
                if (err)
                    throw err;
                res.send("true");
                res.end();
            });
        });
    });
});

/*
    /PlayerAccount/CoinReward
    todo: insert into accountcointransactions
*/
router.post('/CoinReward', jsonParser, (req, res) => {
    const source = req.body.Source;
    const name = req.body.Name;
    const amount = req.body.Amount;

    database.query("SELECT id FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
        let id = result[0].id;
        database.query("UPDATE `" + accountsTable + "`.`accounts` SET `coins`=`coins`+" + amount + " WHERE `name`='" + name + "'", (err, result) => {
            if (err)
                throw err;

            var reason = "";
            if (source == null) {
                reason = "Given";
            } else {
                reason = "Given by " + source;
            }

            database.query("INSERT INTO `" + accountsTable + "`.`accountcointransactions` (accountId, reason, coins) VALUES (" + id + ", '" + reason + "', " + amount + ")", (err, result) => {
                if (err)
                    throw err;
                res.send("true");
                res.end();
            });
        });
    });
});

/*
    /PlayerAccount/PurchaseKnownSalesPackage
    TODO: finish this
*/
router.post('/PurchaseKnownSalesPackage', jsonParser, (req, res) => {
    const name = req.body.AccountName;
    const usingCredits = req.body.UsingCredits;
    const salesPackageId = req.body.SalesPackageId;
    database.query("SELECT id,coins FROM `" + accountsTable + "`.`accountPunishments` WHERE `name`=`" + name + "`", (err, result) => {
        const id = result[0].id;
        const coins = result[0].coins;

    })
});

/*
    /PlayerAccount/PurchaseUnknownSalesPackage
*/
router.post('/PurchaseUnknownSalesPackage', jsonParser, (req, res) => {
    const name = req.body.AccountName;
    const salesPackageName = req.body.SalesPackageName;
    const cost = req.body.Cost;
    const Premium = req.body.Premium;
    const coinPurchase = req.body.CoinPurchase;
    res.end("Success");
    // database.query("SELECT id,coins FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
    //     if (err) {
    //         res.send("Failed");
    //         res.end();
    //         throw err;
    //     }
    //     const id = result[0].id;
    //     const coins = result[0].coins;
    //     if (cost > coins) {
    //         res.send("InsufficientFunds");
    //         res.end();
    //         return;
    //     }

    //     let _premium = Premium ? 1 : 0;
    //     let _coinPurchase = coinPurchase ? 1 : 0;

    //     database.query("INSERT INTO `" + accountsTable + "`.`accountPurchases` (accountId, salesPackageName, salesPackageId, cost, usingCredits, source, Premium, CoinPurchase) VALUES (" + id + ", '" + salesPackageName + "', 0, " + cost + ", false, 'Purchase', " + _premium + ", " + _coinPurchase + ")", (err, result) => {
    //         if (err) {
    //             res.send("Failed 1");
    //             res.end();
    //             throw err;
    //         }

    //         console.log(2);

    //         database.query("INSERT INTO `" + accountsTable + "`.`accountcointransactions` (accountId, reason, coins) VALUES (" + id + ", 'Purchased " + salesPackageName + "', " + cost + ")", (err, result) => {
    //             if (err) {
    //                 res.send("Failed");
    //                 res.end();
    //                 throw err;
    //             }

    //             console.log(3);

    //             res.send("Success");
    //             res.end();
    //         });
    //     });

    // })
});

/*
    /PlayerAccount/GetTasksByCount
    TODO
*/
router.post('/GetTasksByCount', jsonParser, (req, res) => {
    let response = [];

    response.push(
        {
            "Id": "Task Id",
            "Task": "Task",
            "UUID": "Player's uuid"
        }
    );

    res.send(response);
    res.end();
});

/*
    /PlayerAccount/Punish
    NOTE: This isn't tested.
*/
router.post('/Punish', jsonParser, (req, res) => {
    const target = req.body.Target, category = req.body.Category, sentence = req.body.Sentence,
        reason = req.body.Reason, duration = req.body.Duration, admin = req.body.Admin, severity = req.body.Severity;

    // absolutely disgusting but hopefully works
    // made the query into a separate string to not have a bigger line than it already is
    let query = "INSERT INTO `" + accountsTable + "`.`accountPunishments` (target, category, sentence, reason, duration, admin, severity, time) VALUES ('%t%', '%c%', '%s%', '%r%', %d%, '%a%', %ss%, %tt%)";
    query = query.replace("%t%", target).replace("%c%", category).replace("%s%", sentence)
        .replace("%r%", reason).replace("%d%", duration).replace("%a%", admin).replace("%ss%", severity).replace("%tt%", 10);

    database.query(query, (err, result) => {
        if (err)
            throw err;
        res.send("Punished");
        res.end();
    })
});

/*
    /PlayerAccount/GetPunishClient
    TODO: finish this
*/
const bodyparser = require('body-parser');
router.post('/GetPunishClient', async (req, res) => {
    // const name = req.body.name;

    const name = "sqlinjection";

    console.log(req.rawBody);

    database.query("SELECT * FROM `" + accountsTable + "`.`accountpunishments` WHERE `target`='" + name + "'", (err, results) => {
        if (err)
            throw err;

        let punishments = [];

        results.forEach(result => {
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
        })

        let responseJSON = {
            "Name": name,
            "Time": 0,
            "Punishments": punishments
        }

        console.log(responseJSON);

        res.send(JSON.stringify(responseJSON));
        res.end();
    })
});

/*
    /PlayerAccount/RemovePunishment
    NOTE: This isn't tested.
*/
router.post('/RemovePunishment', jsonParser, (req, res) => {
    const target = req.body.Target, punishmentID = req.body.PunishmentId, reason = req.body.Reason, admin = req.body.Admin;
    let query = "DELETE FROM `" + accountsTable + "`.`accountPunishments` WHERE ";

    // super, super, superrrr inefficient probably but this is the only thing i can think of
    var whereString = "";
    let whereConditions = [];
    if (target != null) {
        whereConditions.push("`target`=`" + target + "`");
    }
    if (punishmentID != null) {
        whereConditions.push("`id`=`" + punishmentID + "`");
    }
    if (reason != null) {
        whereConditions.push("`reason`=`" + reason + "`");
    }
    if (admin != null) {
        whereConditions.push("`punisher`=`" + admin + "`");
    }
    whereConditions.forEach((condition, index) => {
        whereString += condition;
        if (index + 1 != whereConditions.length)
            whereString += ",";
    });

    query += whereString;

    database.query(query, (err, result) => {
        if (err)
            throw err;
        res.send("PunishmentRemoved");
        res.end();
    })
});

module.exports = router;