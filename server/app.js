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

  const re = (await axios.get('https://reddit.com/r/funnyvideos.json?limit=1000', { params: { answer: 42 } })).data; 
  //console.log(re); 

  try {
    const results = await client.query("SELECT * FROM users");
    //const results = await client.query("INSERT INTO users VALUES ('arihan', 'password', '10')"); 
    //return res.status(200).send(re);

    for (let child of re["data"]["children"]) {
      
      (async () => {
        try {
          const response = await cohere.generate({
            model: 'xlarge',
            prompt: 'This program will extract relevant information from video titles. Here are some examples:\n\nTitle: Dog falls off chair and kills owner. \n\nExtracted Text:\nAnimal, motion, damage\n--\nCat jumps from building and acts cute. \n\nExtracted Text:\nAnimal, motion, cute\n--\nRabbit escapes farm and causes pandemonium. \n\nExtracted Text:\nAnimal, escape, damage \n--\nTeacher slips on banana in class. \n\nExtracted Text:\nHuman, food, accident, damage\n--\nCoconut falls off tree, demolishing car. \n\nExtracted Text:\nFood, motion, damage\n--\nCoke can explodes during class lecture. \n\nExtracted Text: \nDrink, explosion, school\n--\nGoofy uncle snores loudly. \n\nExtracted Text: \nGoofy, Human, Noise\n--\nFalling coconuts cause havoc. \n\nExtracted Text:\nMotion, damage\n--\nChild eats cheeto while sneezing\n\nExtracted Text:\nChild, Eat, Accident\n--\nDachshund eats spaghetti and poops. \n\nExtracted Text:\nAnimal, Poop\n--\nMan falls in kids bouncy castle. \n\nExtracted Text:\nHuman, Fall, Accident\n--\n' + child.data.title + "\n\nExtracted Text",
            max_tokens: 20,
            temperature: 0.6,
            k: 0,
            p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop_sequences: ["--"],
            return_likelihoods: 'NONE'
          });
          //console.log(`Prediction: ${response.body.generations[0].text}`);

          const results = await client.query("INSERT INTO videos VALUES ($1, $2, $3)", [child.data.url, parseInt(parseInt(child.data.score, 10)/20), response.body.generations[0].text]); 
          //console.log(results);
        } catch (err) {
          console.error("error executing query:", err);
        }
      })();
    }

    (async () => {
      try {
        const results = await client.query("SELECT * FROM videos");
        //console.log(results);
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
    const results = await client.query("INSERT INTO users VALUES ($1, $2)", [body.username, password]);
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
    return res.status(500).send("Database error");
  }
})

app.get("/streaks", async(req, res) => {
  try {
    results = await client.query("SELECT * FROM videos");
    //console.log(results);
  } catch (err) {
    console.error("error executing query:", err);
  }

  //SORT VIDEOS BY MOST LIKED + RANDOMNESS

  console.log(typeof(results)); 
  let results2 = results.rows.sort((a,b) => parseInt(b.likes) - parseInt(a.likes)); 
  
  return res.send(results2); 
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

// COHERE STUFFFF
const cohere = require('cohere-ai');
cohere.init('71ZYLD2B687u89yvSqdYlmwBrruJSuf3GUwNnVss');
(async () => {
  const response = await cohere.generate({
    model: 'xlarge',
    prompt: 'This program will extract relevant information from video titles. Here are some examples:\n\nTitle: Dog falls off chair and kills owner. \n\nExtracted Text:\nAnimal, motion, damage\n--\nCat jumps from building and acts cute. \n\nExtracted Text:\nAnimal, motion, cute\n--\nRabbit escapes farm and causes pandemonium. \n\nExtracted Text:\nAnimal, escape, damage \n--\nTeacher slips on banana in class. \n\nExtracted Text:\nHuman, food, accident, damage\n--\nCoconut falls off tree, demolishing car. \n\nExtracted Text:\nFood, motion, damage\n--\nCoke can explodes during class lecture. \n\nExtracted Text: \nDrink, explosion, school\n--\nGoofy uncle snores loudly. \n\nExtracted Text: \nGoofy, Human, Noise\n--\nFalling coconuts cause havoc. \n\nExtracted Text:\nMotion, damage\n--\nChild eats cheeto while sneezing\n\nExtracted Text:\nChild, Eat, Accident\n--\nDachshund eats spaghetti and poops. \n\nExtracted Text:\nAnimal, Poop\n--\nMan falls in kids bouncy castle. \n\nExtracted Text:\nHuman, Fall, Accident\n--\n',
    max_tokens: 20,
    temperature: 0.6,
    k: 0,
    p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: ["--"],
    return_likelihoods: 'NONE'
  });
  console.log(`Prediction: ${response.body.generations[0].text}`);
})();

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