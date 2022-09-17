const client = require('./client')
const fs = require('fs');

let command = fs.readFileSync(__dirname + '/dbinit.sql',  {encoding:'utf8', flag:'r'});

command = command.replace(/\r\n/g, "");
console.log(command);

(async () => {
  try {
    const results = await client.query(command);
    console.log(results);
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    client.end();
  }
})();