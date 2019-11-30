// const fastify = require('fastify');
// const config = require('./config.json');
// const port = config.port;

// fastify.register(require('./routes/Test'), { prefix: "/testing" });

// fastify.listen(port, (err, address) => {
//     if (err)
//         throw err;
//     console.log(`Server running on ${address}`)
// })


const express = require('express');
const app = express();
const config = require('./config.json');
const port = config.port;

// For being able to get POST data
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use(function (req, res, next) {
//     req.rawBody = '';
//     req.setEncoding('utf8');

//     req.on('data', function (chunk) {
//         req.rawBody += chunk;
//     });

//     next();
// });

// Routes
app.use('/accounts/PlayerAccount', require('./routes/PlayerAccount'));
app.use('/accounts/Dominate', require('./routes/Dominate'));
app.use('/accounts/Pets', require('./routes/Pets'));

app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})