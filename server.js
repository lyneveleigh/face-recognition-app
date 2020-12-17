const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors");
const knex = require("knex");
const { response } = require("express");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "acbd",
    database: "test",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log("data:", data);
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "Sally@gmail.com",
      password: "applies",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync("bacon")
  
  

  return db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("unable to registerd"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*").from("users").where({ id })
    .then(user => {
      if (user.length) {
        res.status(user[0]);
      } else {
      res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('Error getting user'))
});

app.put("/image", (req, res) => {
  const {id} = req.body;
  db('users').where ('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))

});

// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
//     // result == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
//     // result == false
// });

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*
/--> res = this is working 
/signin --> post = success/fail
/register --> post = user
/profile/:userID --> set = user
/image --> Put --> user


*/
