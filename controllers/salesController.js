const { localsName } = require("ejs")
const invModel = require("../models/inventory-model")
const salesModel = require("../models/sales-model")
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
          if (res.locals.accountData) {
            account_id = res.locals.accountData.account_id
            res.render("./sales/sale", {
              title: detailName,
              nav,
              details,
              salesreps,
              inv_id,
              account_id,
              errors: null,
            })
          } else
            req.flash("notice", `Please log in before attempting to purchase a vehicle.`)
            res.render("./account/login", {
            title: "login",
            nav,
            errors: null,
          })
      }
/* ***************************
 *  Set sale pending with post data from customer
 * ************************** */
async function setSalePending(req, res) {
  let nav = await utilities.getNav()
  const { salesrep_id, sale_preference, inv_id, account_id, phone } = req.body
  const salePendingSuccess = await salesModel.setSalePending(
    salesrep_id, 
    sale_preference, 
    inv_id, account_id, 
    phone
  )

  if (salePendingSuccess) {
    req.flash(
      "notice",
      `Congratulations, this sale is now pending!`,
      "notice",
      `Your sales representative will contact you soon!`
    )
    res.status(201).redirect("/")
  } else {
    req.flash("notice", `Something went wrong. Please call me directly, Bob Johns, Sales Manager, at 555-555-1212`)
    res.status(501).redirect("/")
  }
}


      module.exports = salesCont
      

