// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistrationView));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
module.exports = router;