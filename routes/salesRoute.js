// Needed Resources 
const express = require("express")
const router = new express.Router() 
const salesController = require("../controllers/salesController")
const utilities = require("../utilities/")

// Route to build sale view
router.get("/:invId", utilities.handleErrors(salesController.buildSaleView));


module.exports = router;