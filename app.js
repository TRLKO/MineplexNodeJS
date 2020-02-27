/**
 * @author github.com/randomdevlol / memes#2030
*/

const express = require('express');
const app = express();

app.use('/PlayerAccount', require('./routes/PlayerAccount'));
app.use('/', require('./routes/Dominate'))
app.use('/Dominate', require('./routes/Dominate'));
app.use('/Pets', require('./routes/Pets'));

app.listen(8080, () => {
    console.log(`Server Started!`)
})