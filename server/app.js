const axios = require('axios'); 
const { response } = require('express');
const express = require('express')
const app = express()
const port = 3000
const client = require("./db/client");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 

app.use(bodyParser.json());

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
    
    //return res.status(200).send(await bcrypt.compare(body.password, password)); 
    if (bcrypt.compare(body.password, password)) {
      setCookie("username", body.username); 
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Database error");
  }
})

app.get("/streaks", async(req, res) => {
  /* try {
    const results = await client.query("SELECT * FROM laughs WHERE username = $1", [getCookie("username")])
    console.log(results); 
    res.send("Hello World!"); 
  } catch (error) {
    console.error("error executing query:", err);
  } finally {
    client.end(); 
  }*/

  const re = (await axios.get('https://reddit.com/r/funnyvideos.json', { params: { answer: 42 } })).data; 
  //console.log(re); 

  try {
    //const results = await client.query("SELECT * FROM users");

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

    //return res.status(200).send(re); 
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  (async () => {
    try {
      const results = await client.query("SELECT * FROM videos");
      console.log(results);
    } catch (err) {
      console.error("error executing query:", err);
    }
  })();

  //SORT VIDEOS BY MOST LIKED + RANDOMNESS
  
  return results; 
})

app.get("/score", async (req, res) => {
  (async () => {
    try {
      const results = await client.query("SELECT * FROM followings WHERE username = $1", [body.username]); 
      console.log(results);
    } catch (err) {
      console.error("error executing query:", err); 
    }

    return results; 
  })();
})

app.get("/", async (req, res) => {
  (async () => {
    try {
      const results = await client.query("SELECT * FROM videos");
      console.log(results);
    } catch (err) {
      console.error("error executing query:", err);
    }
  })();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/*

function checkFirstVisit() {
  if(document.cookie.indexOf('mycookie')==-1) {
    // cookie doesn't exist, create it now
    document.cookie = 'mycookie=1';
    return false; 
  }
  else {
    // not first visit, so alert
    return true; 
  }
}

if (!checkFirstVisit()) {
  setCookie("username") = 0; 
}

function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*10000000000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

*/