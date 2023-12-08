const utilities = require(".")
const { body, validationResult } = require("express-validator")
const salesModel = require("../models/sales-model")
const invModel = require("../models/inventory-model")
const { localsName } = require("ejs")
const validate = {}

/*  **********************************
 * sales Validation Rules
 * ********************************* */
validate.salesRules = () => {
    return [
    // only alphabetic allowed
    body("account_id")
        .trim()
        .isInt()
        .withMessage("Not a valid format for account_id"),
    body("salesrep_id")
      .trim()
      .isInt()
      .withMessage("salesrep_id does not meet requirements - must be integer.")
      .custom(async (salesrep_id) => {
        const salesrepExists = await salesModel.currentSalesRep(salesrep_id)
        if (!salesrepExists){
          throw new Error("Not a valid Sales Rep Id")
        }
      }),
    body("sale_preference")
      .trim()
      .isAlpha()
      .withMessage("No such sale preference.")
      .custom(async (sale_preference) => {
        const salesPreferenceExists = await salesModel.currentSalePreference(sale_preference)
        if (!salesPreferenceExists){
          throw new Error("Not a valid sales preference")
        }
      }),
      body("inv_id")
      .trim()
      .isInt()
      .withMessage("Inventory Id must be integer.")
      .custom(async (inv_id) => {
        const vehicleExists = await invModel.getInventoryByInvId(inv_id)
        if (vehicleExists.length != 1){
          throw new Error("Vehicle Not in Inventory")
        }
        const vehicleForSale = await salesModel.vehicleForSale(inv_id)
        if (!vehicleForSale) {
            throw new Error("I'm sorry. That vehicle has either recently been sold, or a sale is in process")
        }
      }),
      body("phone")
      .trim()
      .isLength(12)
      .withMessage("phone number must be 10 digits with dashes(-). (example: 555-555-5555")
      .custom(async (phone) => {
        if (!phone.match('[2-9][0-9]{2}-[0-9]{3}-[0-9]{4}'))
          throw new Error("Not a valid US phone number format")
        }),
  ]
}

  /* ******************************
 * Check sales data and return errors
 * ***************************** */
  validate.checkSalesData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const inv_id = req.body.inv_id
        const data = await invModel.getInventoryByInvId(inv_id)
        const details = await utilities.buildDetailPage(data)
        const salesreps = await utilities.buildsalesrepList()
        let nav = await utilities.getNav()
        const detailName = data[0].inv_make + ' ' + data[0].inv_model
        account_id = req.body.account_id
        phone = req.body.phone
        res.render("./sales/sale", {
          title: detailName,
          nav,
          details,
          salesreps,
          inv_id,
          account_id,
          phone,
          errors: errors,
          
      })
      return
    }
    next()
  }
  
module.exports = validate