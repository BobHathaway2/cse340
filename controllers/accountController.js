const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res) {
  const login = await utilities.buildLoginPage()
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    login,
  })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegistrationView(req, res, next) {
  const registration = await utilities.buildRegistrationPage()
  let nav = await utilities.getNav()
  res.render("./account/registration", {
    title: "Registration",
    nav,
    registration,
  })
}
  
  module.exports = { buildLoginView, buildRegistrationView }