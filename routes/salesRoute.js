// Needed Resources 
const express = require("express")
const router = new express.Router() 
const salesController = require("../controllers/salesController")
const utilities = require("../utilities/")

// Route to build sale view
router.get("/sales/", utilities.handleErrors(salesController.buildSale));


module.exports = router;