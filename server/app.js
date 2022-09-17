const express = require('express')
const app = express()
const port = 3000
const client = require("./db/client");

app.get('/', async (req, res) => {
  res.send('Hello World!')

  
  try {
    const results = await client.query("SELECT * FROM users");
    console.log(results);
  } catch (error) {
    console.log(error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




