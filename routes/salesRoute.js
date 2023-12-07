// Needed Resources 
const express = require("express")
const router = new express.Router() 
const salesController = require("../controllers/salesController")
const utilities = require("../utilities/")

// Route to build sale view
router.get("/:invId", utilities.handleErrors(salesController.buildSaleView));

// // Route to put car in pending sale status
// router.post("/sale", utilities.handleErrors(salesController.));



module.exports = router;