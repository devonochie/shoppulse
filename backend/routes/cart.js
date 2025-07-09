const express = require('express');
const { AddCart, GetCart, UpdateCart, RemoveFromCart, ClearCart } = require('../controllers/cart/cart');
const router = express.Router()


router.post('/add', AddCart);
router.get('/:user_id', GetCart);
router.put('/update', UpdateCart);
router.delete('/remove', RemoveFromCart);
router.delete('/clear', ClearCart)

module.exports = router