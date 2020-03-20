/**
 * @author github.com/randomdevlol / memes#2030
*/

require('dotenv').config();

const express = require('express');
const app = express();

app.use('/PlayerAccount', require('./routes/PlayerAccount'));
app.use('/Dominate', require('./routes/Dominate'));
app.use('/Pets', require('./routes/Pets'));
app.use('/Fishing', require('./routes/Fishing'));
app.use('/MineKart', require('./routes/Minekart'));
app.use('/content', require('./routes/Chat'));

app.listen(8080, () => {
    console.log(`Server Started!`)
})