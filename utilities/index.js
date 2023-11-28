const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the classification dropdown list
 ************************** */
Util.getSelect = async function (req, res, next) {
  let data = await invModel.getClassifications() 
  let invSelect = '<select id="invClass" name="classification_id" required>'
  invSelect += '<option hidden disabled selected value> -- select a classification</option>'
  for (let i = 0; i < data.rowCount; i++) {
    invSelect += '<option value=' + data.rows[i].classification_id + '>' + data.rows[i].classification_name + '</option>'
  }
  invSelect += "</select>"
  return invSelect
}


/* **************************************
* Build the classification view HTML
* ************************************* */
Util.buildClassificationGrid = async function(data){
  let grid = '';
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="errorMsg">Oh no! We sold them all? Maybe try another class of vehicles?</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailPage = async function(data){
  let details;
  if(data.length > 0){
    details = '<section id=details>'
    details += '<div id="image-div"><img src="' + data[0].inv_image 
      +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
      +' on CSE Motors" /></div>'
    details += '<h2>' + data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model + '</h2>'
    details += '<article><h3>Description:</h3>' + data[0].inv_description + '</article>'
    details += '<div id="specs">'
    details += '<div id="color">Color: ' + data[0].inv_color + '</div>'
    details += '<div id="mileage">Mileage: ' + Number(data[0].inv_miles).toLocaleString('en') + '</div>'
    details += '<div id="price">Price: $' + Number(data[0].inv_price).toLocaleString('en') + '</div>'
    details += '</div>'
    details += '</section>'
  } else { 
    details = '<p class="errorMsg">Sorry, we must have sold that one. I can\'t find it anywere! Is there another you\'re interested in?</p>'
  }
  return details

}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.passwordHider = async function (){
  const pswdBtn = document.querySelector(".pswdBtn");
  pswdBtn.addEventListener("click", function() {
  const pswdInput = document.querySelector(".pword");
  const type = pswdInput.getAttribute("type");
  if (type == "password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "Hide Password";
  } else {
    pswdInput.setAttribute("type", "password");
    // pswdBtn.innerHTML = "Show Password";
  }
});

}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util