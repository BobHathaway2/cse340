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
      .withMessage("Classification does not meet requirements - 1-8 alphabetic characters.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please use a different classification")
        }
      }),
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
      
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  module.exports = validate