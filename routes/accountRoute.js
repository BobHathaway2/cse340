// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const validate = require('../utilities/account-validation')

// Route to account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to logout user
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route to build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistrationView));

// Route to build the account update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateView))
 
// Process the registration data
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the update data
router.post(
  "/update",
  validate.updateRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.accountUpdate)
)

// Process the password data
router.post(
  "/password",
  validate.passwordRules(),
  validate.checkPasswordData,
  utilities.handleErrors(accountController.accountPassword)  
)
module.exports = router;