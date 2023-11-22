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
  
  module.exports = { buildLoginView }