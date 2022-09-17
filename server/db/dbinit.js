const { client } = require()
const fs = require('fs');

const command = fs.readFileSync('./dbinit.sql');
console.log(command);