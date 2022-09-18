const express = require('express');
const app = express();
const port = 3000;
const client = require("./db/client");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.send('Hello World!')

  try {
    const results = await client.query("SELECT * FROM users");
    console.log(results);
  } catch (error) {
    console.log(error);
  }
})

app.post('/signup', async (req, res) => {
  const body = req.body;
  if (!(body.username && body.password)) {
    return res.status(400).send({ error: "Data not formatted properly" });
  }

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  const password = await bcrypt.hash(body.password, salt);

  try {
    const results = await client.query("INSERT INTO users VALUES ($1, $2, 0)", [body.username, password]);
  } catch (error) {
    return res.status(500).send("Duplicate user!");
  }

  return res.sendStatus(204);
})

app.post('/login', async (req, res) => {
  const body = req.body;
  if (!(body.username && body.password)) {
    return res.status(400).send({ error: "Data not formatted properly" });
  }

  try {
    const results  = await client.query("SELECT * FROM users WHERE username = $1", [body.username]);
    if (results.rows.length == 0) {
      return res.status(404).send({error: "Results are not found "});
    }
    const password = results.rows[0].password;
    
    return res.status(200).send(await bcrypt.compare(body.password, password));
  } catch (error) {
    return res.status(500).send("Database error");
  }
})

app.post('/increment-streak', async (req, res) => {
  const {username} = req.body;

  try {
    const results  = await client.query("SELECT * FROM users WHERE username = $1", [body.username]);
    if (results.rows.length == 0) {
      return res.status(404).send({error: "Username not found "});
    }
    await client.query("UPDATE users SET max_streak = $1 WHERE username = $2", [results.rows[0]['max_streak'] + 1, username]);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send("Database error");
  }
})

app.post('/start-streak', async (req, res) => {
  const {username} = req.body;

  try {
    const results  = await client.query("SELECT * FROM users WHERE username = $1", [body.username]);
    if (results.rows.length == 0) {
      return res.status(404).send({error: "Username not found "});
    }
    await client.query("UPDATE users SET max_streak = $1 WHERE username = $2", [0, username]);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send("Database error");
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

