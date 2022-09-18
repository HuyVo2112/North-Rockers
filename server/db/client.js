require('dotenv').config();
const { Client } = require("pg");

const client = new Client(process.env.DATABASE_URL);
(async () => { await client.connect()})();

module.exports = client;