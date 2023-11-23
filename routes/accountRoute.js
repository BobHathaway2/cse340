// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const validate = require('../utilities/account-validation')

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistrationView));

// Process the registration data
router.post(
    "/register",
    validate.registationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkloginData,
  // utilities.handleErrors(accountController.loginAccount)
)
module.exports = router;