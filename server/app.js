const axios = require('axios'); 
const { response } = require('express');
const express = require('express')
const app = express()
const port = 3000
const client = require("./db/client");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  //res.send('Hello World!')

  //const res = await axios.get('https://httpbin.org/get', { params: { answer: 42 } }); 
  const re = (await axios.get('https://reddit.com/r/funnyvideos.json', { params: { answer: 42 } })).data; 
  //console.log(re); 

  try {
    const results = await client.query("SELECT * FROM users");
    //const results = await client.query("INSERT INTO users VALUES ('arihan', 'password', '10')"); 
    //return res.status(200).send(re);

    for (let child of re["data"]["children"]) {
      
      (async () => {
        try {
    
          const results = await client.query("INSERT INTO videos VALUES ($1, $2)", [child.data.url, parseInt(parseInt(child.data.score, 10)/20)]); 
          //console.log(results);
        } catch (err) {
          console.error("error executing query:", err);
        }
      })();
    }

    (async () => {
      try {
        const results = await client.query("SELECT * FROM videos");
        console.log(results);
      } catch (err) {
        console.error("error executing query:", err);
      } finally {
        client.end();
      }
    })();

    return res.status(200).send(re); 
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
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
    console.log(error);
    return res.status(500).send("Database error");
  }
  
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
