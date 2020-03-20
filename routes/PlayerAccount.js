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
*/
router.post('/Login', jsonParser, async (req, res) => {
    let {
        Uuid,
        Name,
        IpAddress
    } = req.body;

    functions.getClient(Uuid, Name, (response) => {
        res.end(response);
    });
});

/*
    /PlayerAccount/GetAccountByUUID
*/
router.post('/GetAccountByUUID', rawBody, (res, req) => {
    let uuid = req.rawBody.replaceAll('"', "");
    functions.getClient(uuid, null, (response) => {
        res.end(response);
    })
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
        res.json(response);
    });
});

/*
    /PlayerAccount/GemReward
*/
router.post('/GemReward', jsonParser, (req, res) => {
    let {
        Source,
        Name,
        Amount
    } = req.body;

    functions.reward("gem", Name, Source, Amount, (response) => {
        res.end(response);
    })
});

/*
    /PlayerAccount/CoinReward
*/
router.post('/CoinReward', jsonParser, (req, res) => {
    let {
        Source,
        Name,
        Amount
    } = req.body;

    functions.reward("coin", Name, Source, Amount, (response) => {
        res.end(response);
    })
});

/*
    /PlayerAccount/PurchaseKnownSalesPackage
*/
router.post('/PurchaseKnownSalesPackage', jsonParser, (req, res) => {
    let {
        AccountName,
        UsingCredits,
        SalesPackageId
    } = req.body;

    database.query("SELECT id FROM `" + accountsTable + "`.`accounts` WHERE `name`=`" + AccountName + "`", (err, result) => {
        if (err) {
            res.end("Failed");
            throw err;
        }
        const id = result[0].id;

        database.query("INSERT INTO `" + accountsTable + "`.`accountpurchases` (accountId, salesPackageId, usingCredits, known) VALUES (" + id + ", " + SalesPackageId + ", " + UsingCredits + ", 1)", (err, result) => {
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
    let {
        AccountName,
        SalesPackageName,
        Cost,
        Premium,
        CoinPurchase
    } = req.body;

    database.query("SELECT id,coins FROM `" + accountsTable + "`.`accounts` WHERE `name`='" + AccountName + "'", (err, result) => {
        if (err) {
            res.end("Failed");
            throw err;
        }
        const id = result[0].id;
        const coins = result[0].coins;
        if (Cost > coins) {
            res.end("InsufficientFunds");
            return;
        }

        let _premium = Premium ? 1 : 0;
        let _coinPurchase = CoinPurchase ? 1 : 0;

        database.query("INSERT INTO `" + accountsTable + "`.`accountpurchases` (accountId, salesPackageName, cost, premium, coinPurchase, known) VALUES (" + id + ", '" + SalesPackageName + "', " + Cost + ", " + _premium + ", " + _coinPurchase + ", 0)", (err, result) => {
            if (err) {
                res.end("Failed");
                throw err;
            }
            res.end("Success");
        })
    })
});

/*
    /PlayerAccount/GetTasksByCount
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
    let {
        Target,
        Category,
        Sentence,
        Reason,
        Duration,
        Admin,
        Severity
    } = req.body;

    // absolutely disgusting but hopefully works
    // made the query into a separate string to not have a bigger line than it already is
    let query = "INSERT INTO `" + accountsTable + "`.`accountPunishments` (target, category, sentence, reason, duration, admin, severity, time) VALUES ('%t%', '%c%', '%s%', '%r%', %d%, '%a%', %ss%, %tt%)";
    query = query.replace("%t%", Target).replace("%c%", Category).replace("%s%", Sentence)
        .replace("%r%", Reason).replace("%d%", Duration).replace("%a%", Admin).replace("%ss%", Severity).replace("%tt%", 10);

    database.query(query, (err, result) => {
        if (err)
            throw err;
        res.end("Punished");
    })
});

/*
    /PlayerAccount/GetPunishClient\
*/
router.post('/GetPunishClient', rawBody, async (req, res) => {
    const name = req.rawBody;

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
*/
router.post('/RemovePunishment', jsonParser, (req, res) => {
    let {
        Target,
        PunishmentId,
        Reason,
        Admin
    } = req.body;

    let query = "DELETE FROM `" + accountsTable + "`.`accountPunishments` WHERE ";

    // super, super, superrrr inefficient probably but this is the only thing i can think of
    var whereString = "";
    let whereConditions = [];
    if (target != null) {
        whereConditions.push("target='" + Target + "'");
    }
    if (punishmentID != null) {
        whereConditions.push("id='" + PunishmentId + "'");
    }
    if (reason != null) {
        whereConditions.push("reason='" + Reason + "'");
    }
    if (admin != null) {
        whereConditions.push("admin='" + Admin + "'");
    }
    whereConditions.forEach((condition, index) => {
        whereString += condition;
        console.log(whereString);
        if (index + 1 != whereConditions.length)
            whereString += " AND ";
    });

    query += whereString;

    if (process.env.STAGE == "DEVELOPMENT") {
        console.log(whereString);
        console.log(query);
    }

    database.query(query, (err, result) => {
        if (err)
            throw err;
        res.send("PunishmentRemoved");
        res.end();
    })
});

router.post('/SaveCustomBuild', jsonParser, (req, res) => {
    functions.saveCustomBuild(req.body, () => {
        res.end("okay");
    })
})

module.exports = router;