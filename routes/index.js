var express = require('express');
var router = express.Router();
const axios = require('axios');

const markDuplicates = async (data) => {
  let key = 'confName'; //To check duplicate conferences
  let nameLookup = new Set();
  data.forEach((obj, index, self) => {
    obj.hasExactDuplicate = 'no';
    if(nameLookup.has(obj[key]))
      obj.hasExactDuplicate = 'yes';
    else nameLookup.add(obj[key]);
  });
  return data;
}

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let request = await axios("https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences")
    let data = request.data;
    //Identify and mark duplicates
    data.free = await markDuplicates(data.free);
    data.paid = await markDuplicates(data.paid);
    res.render('index', { title: 'Konfhub', list: data});
  } catch(err) {
    console.log(err);
  }
});

//To fetch all records without modifying
router.get('/list', async (req,res,next) => {
  try {
    let request = await axios("https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences")
    let data = request.data;

    res.status(200).json({
      data: { list: data },
    }).send();
  } catch(err) {
    console.log(err);
  }
});

module.exports = router;
