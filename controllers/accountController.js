const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {application} = require("express")
require("dotenv").config()

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
*  Deliver Account Management view
* *************************************** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/management", {
    title: "Account Management",
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
*  Deliver Update view
* *************************************** */
async function buildUpdateView(req, res, next) {
  const account_id = req.params.account_id
  const data = await accountModel.getAccountById(account_id)
  let nav = await utilities.getNav()
  res.render("./account/update", {
    title: "Update Account Information",
    nav,
    data,
    errors: null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", `Sorry, there was an error processing the registration.`)
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
  })
}

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, the registration failed.`)
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", `Please check your credentials and try again.`)
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
 }


 /* ****************************************
 *  Process update request
 * ************************************ */
async function accountUpdate(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email} = req.body

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Your account information has been updated.`
    )
    res.status(201).render("account/management", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {

    req.flash("notice", `Sorry, the update failed.`)
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Password update
* *************************************** */
async function accountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", `Unable to hash password.`)
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: error,
  })
}

  const regResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Your password has been updated.`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, the password update failed.`)
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
    })
  }
}


module.exports = { buildLoginView, buildRegistrationView, registerAccount, accountLogin, buildAccountManagementView, accountLogout, accountUpdate, buildUpdateView, accountPassword}
