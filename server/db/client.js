const { Client } = require("pg");

export const client = new Client(process.env.DATABASE_URL);

