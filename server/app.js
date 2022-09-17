const axios = require('axios'); 
const { response } = require('express');
const express = require('express')
const app = express()
const port = 3000
const client = require("./db/client");

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})