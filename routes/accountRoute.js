// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistrationView));

// Route to post to database
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;