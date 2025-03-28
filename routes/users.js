require('../models/connection');

var express = require('express');
var router = express.Router();

const User = require('../models/user');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// POST /singup
router.post('/signup', (req, res) => {
  if (req.body.firstname === "" || req.body.firstname === undefined ||
    req.body.username === "" || req.body.username === undefined ||
    req.body.password === "" || req.body.password === undefined) {
    // Error if username or pwd is not defined or empty
    res.json({ result: false, error: "Missing or empty fields" });
    return
  }
  User.findOne({ username: req.body.username }).then(data => {
    if (data) {
      // Error if username already exists in DB
      res.json({ result: false, error: "User already exists" });
    } else {
      // Creates new user
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });
      // Save user in DB
      newUser.save().then(newDoc => {
        res.json({ result: true, newDoc });
      })
    }
  })
});

// POST /signin
router.post('/signin', (req, res) => {
  if (req.body.username === "" || req.body.username === undefined ||
    req.body.password === "" || req.body.password === undefined) {
      // Error if username or pwd is not defined or empty
      res.json({ result: false, error: "Missing or empty fields" });
      return
  }
  User.findOne({ username: req.body.username }).then(data => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        // Error if user is not found
        res.json({ result: true, token : data.token, firstname: data.firstname });
        } else {
          res.json({ result: false, error: "User not found"});
      }
  })
})

module.exports = router;
