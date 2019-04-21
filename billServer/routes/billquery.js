var express = require('express');
var router = express.Router();
const Bill = require('./helpers/Bill')

router.get('/', async function (req, res, next) {
  try {
    const {
      ability,
      param
    } = req.query
    const bill = await new Bill(ability, param).init()
    const kl = bill.get()
    res.send(kl)
  } catch (e) {
    console.error(e)
  }
});

module.exports = router;