const express = require("express");
const { getProduct } = require("./Controllers/productDetailsController");
const router = express.Router();

// Add a leading "/" to the path
router.post("/get-product", getProduct);

module.exports = router;
