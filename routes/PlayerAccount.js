/**
 * @author github.com/randomdevlol / memes#2030
*/

const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const config = require('../config.json');
const database = require('../Database');
const accountsTable = config.table_accounts;

const functions = require('../functions/Player');

// For purchases/transactions because for some reason I can't use the the transactions and accounttransactions table
database.query("CREATE TABLE IF NOT EXISTS `" + accountsTable + "`.`accountpurchases` (`id` INT(11) NOT NULL AUTO_INCREMENT, `accountId` INT(11) NOT NULL , `salesPackageName` VARCHAR(30) NULL , `salesPackageId` INT(11) NULL , `cost` INT(11) NULL , `usingCredits` INT(1) NULL , `source` VARCHAR(30) NULL , `premium` INT(1) NULL , `coinPurchase` INT(1) NULL , `known` INT(1) NOT NULL, PRIMARY KEY(`id`), KEY(`accountId`), FOREIGN KEY(`accountId`) REFERENCES `accounts`(`id`));", (err, result) => {
    if (err)
        throw err;
});

/** @source https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string */
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function rawBody(req, res, next) {
    rawBody = [];
    req.on('data', (chunk) => {
        rawBody.push(chunk);
    }).on('end', () => {
        req.rawBody = Buffer.concat(rawBody).toString();
        next();
    });
}

/*
    /PlayerAccount/Login
    side note- i hate this
*/
router.post('/Login', jsonParser, async (req, res) => {
    const uuid = req.body.Uuid;
    const name = req.body.Name;
    const ip = req.body.IpAddress;

    database.query("SELECT id, name, rank, rankExpire, rankPerm, lastLogin, gems, coins, donorRank FROM `" + accountsTable + "`.`accounts` WHERE `uuid`='" + uuid + "' LIMIT 1", (err, result) => {
        if (err)
            throw err;

        if (result[0] == undefined || result[0] == null) {
            functions.createAccount(uuid, name, (response) => {
                res.end(JSON.stringify(response));
            });
            return;
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
        data.DonorToken.donated = result[0].donorRank == null || result[0].donorRank == "" ? false : true;

        functions.getPunishments(name, (response) => {
            data.Punishments = response;

            functions.getPurchases(data.AccountId, (known, unknown) => {
                data.DonorToken.UnknownSalesPackages = unknown;
                data.DonorToken.SalesPackages = known;

                data.DonorToken.Transactions = [];
                data.DonorToken.CoinRewards = [];
                data.DonorToken.CustomBuilds = [];
                data.DonorToken.Pets = [];

                res.end(JSON.stringify(data));
            })
        })
        // RESPONSE:
        // let responseJSON = {
        //     "AccountId": id,
        //     "Name": name,
        //     "Rank": rank,
        //     "RankPerm": rankPerm,
        //     "RankExpire": parseInt(rankExpire),
        //     "EconomyBalance": 100,
        //     "LastLogin": parseInt(lastLogin),
        //     "Time": 0,
        //     "DonorToken": {
        //         "Gems": gems,
        //         "Donated": donated,
        //         "SalesPackages": known,
        //         "UnknownSalesPackages": unknown,
        //         "Transactions": [],
        //         "CoinRewards": [],
        //         "Coins": coins,
        //         "CustomBuilds": [],
        //         "Pets": []
        //     },
        //     "Punishments": punishments
        // }
    });
});

/*
    /PlayerAccount/GetAccount
*/
router.post('/GetAccountByUUID', jsonParser, (res, req) => {
    //TODO aka im lazy
});

/*
    /PlayerAccount/RankUpdate
*/
router.post('/RankUpdate', jsonParser, (req, res) => res.end(req.body.Rank));

/*
    /PlayerAccount/GetMatches
*/
router.post('/GetMatches', rawBody, (req, res) => {
    const name = req.rawBody;
    functions.getMatches(name.replaceAll('"', ""), (response) => {
        res.end(response + "")
    });
});

/*
    /PlayerAccount/GemReward
*/
router.post('/GemReward', jsonParser, (req, res) => {
    const source = req.body.Source;
    const name = req.body.Name;
    const amount = req.body.Amount;
    functions.reward("gem", name, source, amount, (response) => {
        res.end(response);
    })
});

/*
    /PlayerAccount/CoinReward
    todo: insert into accountcointransactions
*/
router.post('/CoinReward', jsonParser, (req, res) => {
    const source = req.body.Source;
    const name = req.body.Name;
    const amount = req.body.Amount;

    functions.reward("coin", name, source, amount, (response) => {
        res.end(response);
    })
});

/*
    /PlayerAccount/PurchaseKnownSalesPackage
    TODO: finish this
*/
router.post('/PurchaseKnownSalesPackage', jsonParser, (req, res) => {
    const name = req.body.AccountName;
    const usingCredits = req.body.UsingCredits;
    const salesPackageId = req.body.SalesPackageId;
    database.query("SELECT id FROM `" + accountsTable + "`.`accounts` WHERE `name`=`" + name + "`", (err, result) => {
        if (err) {
            res.end("Failed");
            throw err;
        }
        const id = result[0].id;

        database.query("INSERT INTO `" + accountsTable + "`.`accountpurchases` (accountId, salesPackageId, usingCredits, known) VALUES (" + id + ", " + salesPackageId + ", " + usingCredits + ", 1)", (err, result) => {
            if (err) {
                res.end("Failed");
                throw err;
            }
            res.end("Success");
        })
    })
});

/*
    /PlayerAccount/PurchaseUnknownSalesPackage
*/
router.post('/PurchaseUnknownSalesPackage', jsonParser, (req, res) => {
    const name = req.body.AccountName;
    const salesPackageName = req.body.SalesPackageName;
    const cost = req.body.Cost;
    const premium = req.body.Premium;
    const coinPurchase = req.body.CoinPurchase;
    database.query("SELECT id,coins FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + name + "'", (err, result) => {
        if (err) {
            res.send("Failed");
            res.end();
            throw err;
        }
        const id = result[0].id;
        const coins = result[0].coins;
        if (cost > coins) {
            res.send("InsufficientFunds");
            res.end();
            return;
        }

        let _premium = premium ? 1 : 0;
        let _coinPurchase = coinPurchase ? 1 : 0;

        database.query("INSERT INTO `" + accountsTable + "`.`accountpurchases` (accountId, salesPackageName, cost, premium, coinPurchase, known) VALUES (" + id + ", '" + salesPackageName + "', " + cost + ", " + _premium + ", " + _coinPurchase + ", 0)", (err, result) => {
            if (err) {
                res.end("Failed");
                throw err;
            }
            res.end("Success");
        })
    })
});

/*
    /PlayerAccount/GetTasksByCount\
*/
router.post('/GetTasksByCount', jsonParser, (req, res) => {
    functions.getTasks((response) => {
        res.end(response);
    })
});

/*
    /PlayerAccount/Punish
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
    /PlayerAccount/GetPunishClient\
*/
router.post('/GetPunishClient', rawBody, async (req, res) => {
    const name = req.rawBody;

    // console.log(req.body, req.body.name, req.rawBody);

    functions.getPunishments(name, (response) => {
        let responseJSON = {
            "Name": name,
            "Time": 0,
            "Punishments": response
        }

        res.end(JSON.stringify(responseJSON));
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
        whereConditions.push("target='" + target + "'");
    }
    if (punishmentID != null) {
        whereConditions.push("id='" + punishmentID + "'");
    }
    if (reason != null) {
        whereConditions.push("reason='" + reason + "'");
    }
    if (admin != null) {
        whereConditions.push("admin='" + admin + "'");
    }
    whereConditions.forEach((condition, index) => {
        // console.log(condition, condition.replaceAll("'", ""))
        whereString += condition;//.replaceAll("'", "");
        console.log(whereString);
        if (index + 1 != whereConditions.length)
            whereString += " AND ";
    });

    query += whereString;
    console.log(whereString);
    console.log(query);

    database.query(query, (err, result) => {
        if (err)
            throw err;
        res.send("PunishmentRemoved");
        res.end();
    })
});

module.exports = router;