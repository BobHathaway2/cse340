const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
  
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build details view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    if (inv_id == 'my500') {
      throw new Error('My triggered HTTP 500');
    }
    const data = await invModel.getInventoryByInvId(inv_id)
    const details = await utilities.buildDetailPage(data)
    let nav = await utilities.getNav()
    const detailName = data[0].inv_make + ' ' + data[0].inv_model
    res.render("./inventory/detail", {
      title: detailName,
      nav,
      details,
    })
  } catch (error) {
    error.statusCode = 500
    throw error
  }
}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let mlinks = await utilities.buildManagementPageHTML()
  res.render("./inventory/management", {
  title: "Vehicle Management",
  nav,
  mlinks,
  errors: null,
})
}

/* **********************************
 *  Build Add New Classification view
 * ******************************** */
invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  const cform = await utilities.buildAddClassificationPage()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    cform,
    errors: null,
  })
}

/* ***************************
 *  Build Add New Vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let vform = "I'm here"
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    vform,
    errors: null,
  })
}


/* ****************************************
*  Process New Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let cform = await utilities.buildAddClassificationPage()

  const {classification_name} = req.body

  const addClassificationResult = await invModel.addClassification(classification_name)
  
  if (addClassificationResult.name != 'error') {
    req.flash(
      "notice",
      `Congratulations, you\'ve added the classification: ${addClassificationResult}`
    )
    res.status(201).render("./inventory/add-Classification", {
      title: "Add New Classification",
      nav,
      cform,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, the classification was not added.`)
    res.status(501).render("./inventory/add-Classification", {
      title: "Add New Classification",
      nav,
      cform,
    })
  }
}

module.exports = invCont