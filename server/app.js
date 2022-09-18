const axios = require('axios'); 
const { response } = require('express');
const express = require('express')
const app = express()
const port = 3000
const client = require("./db/client");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const cors = require('cors')

app.use(bodyParser.json());
app.use(cors())

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
    const results = await client.query("INSERT INTO users VALUES ($1, $2, $3)", [body.username, password, 0]);
  } catch (error) {
    console.log(error);
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
    console.log(body.password);

    if (await bcrypt.compare(body.password, password)) {
      // setCookie("username", body.username); 
      return res.status(200).send(true);
    }
    return res.status(200).send(false);
  } catch (error) {
    return res.status(500).send("Database error");
  }
})

app.get("/streaks", async(req, res) => {
  const re = (await axios.get('https://reddit.com/r/funnyvideos.json?limit=1000', { params: { answer: 42 } })).data; 
  //console.log(re); 

  try {
    //const results = await client.query("SELECT * FROM users");
    for (let child of re["data"]["children"]) {
      try {
        let url;
        if (child.data.domain == "v.redd.it") {
          if (child.data.secure_media != null) {
            url = child.data.secure_media.reddit_video.fallback_url;
          } else {
            url = child.data.media.reddit_video.fallback_url;
          }
          const results = await client.query("INSERT INTO videos VALUES ($1, $2)", [url, parseInt(parseInt(child.data.score, 10)/20)]);
        } 
        //console.log(results);
      } catch (err) {
        console.error("error executing query:", err); 
      }
    }
    //return res.status(200).send(re); 
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  let results; 

  try {
    results = await client.query("SELECT * FROM videos");
    console.log(results);
  } catch (err) {
    console.error("error executing query:", err);
  }

  //SORT VIDEOS BY MOST LIKED + RANDOMNESS

  console.log(typeof(results)); 
  let results2 = results.rows.sort((a,b) => parseInt(b.likes) - parseInt(a.likes)); 
  
  return res.send(results2); 
})

app.get("/score", async (req, res) => {
  const body = req.body;
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

app.post("/follow", async (req, res) => {
  const body = req.body; 

  try {
    const results = await client.query("INSERT INTO followings VALUES ($1, $2, 0)", [body.username, body.following_username]); 
  } catch (error) {
    return res.status(500).send("Duplicate user!"); 
  }

  return res.sendStatus(204); 
})

app.post('/increment-streak', async (req, res) => {
  const {username} = req.body;

  try {
    const results  = await client.query("SELECT * FROM users WHERE username = $1", [username]);
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
    const results  = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    if (results.rows.length == 0) {
      return res.status(404).send({error: "Username not found "});
    }
    await client.query("UPDATE users SET max_streak = $1 WHERE username = $2", [0, username]);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send("Database error");
  }
})

app.get('/user', async (req, res) => {
  const {username} = req.query;

  try {
    const results  = await client.query("SELECT * FROM users");
    const users = [];

    for (const record of results.rows) {
      if (record.username.includes(username)) {
        users.push(record);
      }
    }
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Database error");
  }
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