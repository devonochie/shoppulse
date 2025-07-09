const express = require("express");
const  router = express.Router()
const auth = require('./auth')
const product = require('./product');
const order = require('./order')
// const { verifyAccessToken } = require("../helpers/jwt");
const cart = require('./cart')

router.get('/', (req, res) => {
   res.end('hey');
 });
 

router.use('/auth', auth)
router.use('/product', product )
router.use('/cart', cart)
router.use('/order', order)



module.exports = router