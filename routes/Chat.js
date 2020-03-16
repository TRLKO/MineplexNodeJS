/**
 * @author github.com/randomdevlol / memes#2030
 * @note to all reading this code, I am sorry
*/

const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const config = require('../config.json');
const filteredWords = require('../chatfilter.json');

router.post('/item/moderate', jsonParser, (req, res) => {
    let parts = req.body.content.parts;
    let message = parts[0].content;

    let response = {
        content: {
            parts: []
        }
    }

    if (!config.chat_filter) {
        response.content.parts.push({ replacement: message });
        return res.json(response);
    }

    let filteredMessage = "";
    let messageSplit = message.split(" ");
    messageSplit.forEach((part, index) => {
        if (filteredWords.includes(part.toLowerCase())) {
            let filteredWord = "";
            for (var i = 0; i < part.length; i++) {
                filteredWord += "*";
            }
            filteredMessage += filteredWord;
        } else {
            filteredMessage += part;
        }

        if (++index == messageSplit.length) {
            response.content.parts.push({ replacement: filteredMessage });
            res.json(response);
        } else {
            filteredMessage += " ";
        }
    })
})

module.exports = router;