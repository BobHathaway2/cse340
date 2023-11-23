const utilities = require("../utilities")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegistrationView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/registration", {
    title: "Registration",
    nav,
    errors: null,
  })
}
  

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Process login
* *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const regResult = await accountModel.loginAccount(
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve logged in ${account_firstname}.`
    )
    res.status(201).render("index", {title: "Home", nav})
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    })
  }
}
module.exports = { buildLoginView, buildRegistrationView, registerAccount, loginAccount}
