const salesModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const salesCont = {} 

/* ***************************
 *  Build sale view
 * ************************** */
salesCont.buildSaleView = async function (req, res, next) {
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
module.export salesCont