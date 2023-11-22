const invModel = require("../models/inventory-model")
const Util = {}

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

/* **************************************
* Build the login view HTML
* ************************************ */
Util.buildLoginPage = async function(){
  let login = '<div id="login-block1">'
    login += '<div id="login-block2">'
      login += '<form> \
      <label for="email">Email Address:</label><br> \
      <input type="text" id="email" name="account_email"><br> \
      <label for="password">Password:</label><br> \
      <input type="password" class="pword" name="account_password"> \
      <span class="pswdBtn">Show Password</span> \
      </form>'
      login += '<div id=pw-verbiage>'
        login += '<p> Passwords must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character</p>'
      login += '</div>'
      login += '<button>Login</button>'
    login += '</div>'
    login += '<p>No account? <a href="/account/registration">Sign-up!</p>'
    login += '</div>'
  return login
}


/* **************************************
* Build the Registration view HTML
* ************************************ */
Util.buildRegistrationPage = async function(){
  let registration = '<div id="registration-block1">'
    registration += '<div id="registration-block2">'
      registration += '<form> \
      <label for="fname">First name:</label><br> \
      <input type="text" id="fname" name="account_firstname"><br> \
      <label for="lname">Last name:</label><br> \
      <input type="text" id="lname" name="account_lastname"><br> \
      <label for="email">Email Address:</label><br> \
      <input type="text" id="email" name="account_email"><br> \
      <label for="passwd">Password:</label><br> \
      <input type="password" id="passwd" name="account_password"> \
      </form>'
      registration += '<button id="password-hider">Show Password</button>'
      registration += '<div id=pw-verbiage>'
        registration += '<p> Passwords must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character</p>'
        registration += '</div>'
      registration += '<button>Register</button>'
    registration += '</div>'
    registration += '</div>'
  return registration
}
/* **************************************
* Build the registration view HTML
* ************************************ */



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.passwordHider = async function (document){
  const pswdBtn = document.querySelector(".pswdBtn");
  pswdBtn.addEventListener("click", function() {
  const pswdInput = document.querySelector(".pword");
  const type = pswdInput.getAttribute("type");
  if (type == "password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "Hide Password";
  } else {
    pswdInput.setAttribute("type", "password");
    pswdBtn.innerHTML = "Show Password";
  }
});

}


module.exports = Util