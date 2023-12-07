const invModel = require("../models/inventory-model")
// const salesModel = require("../models/sales-model")
const utilities = require("../utilities/")

const salesCont = {} 

/* ***************************
 *  Build sale view
 * ************************** */
salesCont.buildSaleView = async function (req, res, next) {
          const inv_id = req.params.invId
          const data = await invModel.getInventoryByInvId(inv_id)
          const details = await utilities.buildDetailPage(data)
          const salesreps = await utilities.buildsalesrepList()
          let nav = await utilities.getNav()
          const detailName = data[0].inv_make + ' ' + data[0].inv_model
          res.render("./sales/sale", {
            title: detailName,
            nav,
            details,
            salesreps,
            errors: null,
          })
      }

      module.exports = salesCont