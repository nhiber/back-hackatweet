require("../models/connection");

const express = require("express");
const router = express.Router();

const Tweet = require("../models/tweet");


//route get
//----------------------------------------------------------------------------

/* GET tweet list */
router.get("/", (req, res) => {
  Tweet.find().then((data) => {
    
    let obj = {};
    for (let tweet of data){
        for (let hashtag of tweet.hashtagList){
            if (Object.keys(obj).some((e) => e === hashtag)){
                obj[hashtag] +=1;
            } else {
                obj[hashtag] = 1;
            }
        }
    }
    
    res.json({ obj });
  });
});



module.exports = router;
