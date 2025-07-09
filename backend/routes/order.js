const express = require('express')
const { List, Create, GetMyOrder, UpdateOrder } = require('../controllers/order/orders')
const grantAccess = require('../grantAccess')
const router = express.Router()

router.get('/', List)
router.post('/create/:user_id', Create)
router.get('/:user_id', GetMyOrder)
router.put('/status', grantAccess(['update_any']), UpdateOrder)


module.exports = router