require("../models/connection");

const express = require("express");
const router = express.Router();

const Tweet = require("../models/tweet");

//----------------------------------------------------------------------------

//Route post
router.post("/", (req, res) => {
  //Create add new tweet
  const newTweet = new Tweet({
    firstname: req.body.firstname,
    username: req.body.username,
    time: req.body.time,
    content: req.body.content,
    usersLike: req.body.usersLike,
    hashtagList: req.body.hashtagList,
  });
  newTweet.save().then((newDoc) => {
    console.log(newDoc);
    res.json({ result: true, newDoc });
  });
});

//route get
//----------------------------------------------------------------------------

/* GET tweet list */
router.get("/", (req, res) => {
  Tweet.find().then((data) => {
    res.json({ data });
  });
});

//----------------------------------------------------------------------------

/* POST add user in usersLike list */
router.post("/addUserLike", (req, res) => {
  const { currentUser, content } = req.body;

  Tweet.updateOne(
    { content: content },
    { $push: { usersLike: currentUser } }
  ).then((data) => {
    console.log("data =>", data);
    res.json({ result: true });
  });
});

//----------------------------------------------------------------------------

/* POST remove user in usersLike list */
router.post("/deleteUserLike", (req, res) => {
  const { currentUser, content } = req.body;

  Tweet.updateOne(
    { content: content },
    { $pull: { usersLike: currentUser } }
  ).then((data) => {
    res.json({ result: true });
  });
});

//----------------------------------------------------------------------------//----------------------------------------------------------------------------

/* POST remove tweet */
router.post("/deleteTweet", (req, res) => {
  const { content } = req.body;
  Tweet.deleteOne({ content: content }).then((data) => {
    res.json({ result: true });
  });
});

//----------------------------------------------------------------------------

/* GET tweet by likes */
router.get("/likes", (req, res) => {
  Tweet.find().then((data) => {
    let obj = {};
    for (let tweet of data) {
      if (tweet.usersLike.length > 0) {
        if (Object.keys(obj).some((e) => e === tweet.username)) {
          obj[tweet.username] += tweet.usersLike.length;
        } else {
          obj[tweet.username] = tweet.usersLike.length;
        }
      }
    }
    res.json({ obj });
  });
});

//----------------------------------------------------------------------------

module.exports = router;
