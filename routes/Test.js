const fastify = require("fastify");

async function routes(router, options) {
    router.get('/', (req, res) => {
        let obj = { msg: "hello world" }
        res.send(JSON.stringify(obj));
    });
}

module.exports = routes;