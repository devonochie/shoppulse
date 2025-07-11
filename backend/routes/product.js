const express = require('express')
const { Create, Get, GetList, Update, Delete, Search } = require('../controllers/product/product')
const upload = require('../upload')
const { verifyAccessToken } = require('../helpers/jwt')
const grantAccess = require('../grantAccess')
const router = express.Router()


router.get('/search',  Search)

// Product Routes
router.post(
	"/create",
	upload.single('photo')
	,
	// verifyAccessToken,
	grantAccess(['create_any']),
	Create
);

router.get(
	"/:id",
	// verifyAccessToken,
	grantAccess(['view_any'], 'product'),
	Get
);

router.get("/", GetList);

router.put(
	"/:id",
	// verifyAccessToken,
	grantAccess(["update_any"], "product"),
	Update
);

router.delete(
	"/:id",
	verifyAccessToken,
	grantAccess("delete_any", "product"),
	Delete
);




module.exports = router;






























































































































































































































































































































































































