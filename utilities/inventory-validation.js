const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}
 
/*  **********************************
 * Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // only alphabetic allowed
    body("classification_name")
      .trim()
      .isLength({min: 1, max: 8})
      .isAlpha()
      .withMessage("Classification does not meet requirements."),
  ]
}

  /* ******************************
 * Check classification data and return errors
 * ***************************** */
  validate.checkClassificationData = async (req, res, next) => {
    const {classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let cform = await utilities.buildAddClassificationPage()
      
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        cform,
        classification_name,
      })
      return
    }
    next()
  }

  module.exports = validate