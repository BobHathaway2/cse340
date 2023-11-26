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
      errors: null,
    })
  } catch (error) {
    error.statusCode = 500
    throw error
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
  title: "Vehicle Management",
  nav,
  errors: null,
})
}

/* **********************************
 *  Build Add New Classification view
 * ******************************** */
invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* **********************************
 *  Build Add Inventory view
 * ******************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let invSelect = await utilities.getSelect()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    invSelect,
    errors: null,
  })
}

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  const addClassificationResult = await invModel.addClassification(classification_name)
  
  if (addClassificationResult.name != 'error') {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'ve added a new classification and it's been included in the navigation bar`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    res.status(501).render("./inventory/add-Classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}


module.exports = invCont