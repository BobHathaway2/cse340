const pool = require("../database")

/* ***************************
 *  Get all sales people
 * ************************** */
async function getSalesPeople(){

    try {
      const data = await pool.query(
        `SELECT * FROM public.account AS a
        WHERE a.account_type = 'sales'`
      )
      return data.rows
    } catch (error) {
      console.error("getSalesPeople error " + error)
    }
}

/* ***************************
 *  Current Sales Representative?
 * ************************** */
async function currentSalesRep(salesrep_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.account AS a
      WHERE account_id =  $1 AND a.account_type = 'sales'`,
      [salesrep_id]
    )
    if (data.rowCount > 0){
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("currentSalesRep error " + error)
  }
}

/* ***************************
 *  Vehicle in Sales Process?
 * ************************** */
async function vehicleForSale(inv_id) {
  try {
    const data = await pool.query(
      `SELECT sale_status FROM public.sales_processing
      WHERE inv_id =  $1`,
      [inv_id]
    )
    if (data.rowCount > 0){
      return false
    } else {
      return true
    }
  } catch (error) {
    console.error("vehicleForSale Error" + error)
  }
}

async function currentSalePreference(sale_preference) {
  try {
    const statuses = await pool.query(`select * FROM unnest(enum_range(NULL::sale_completion)) as t(name) WHERE t.name::text = 'online'`)
    if (statuses.rowCount > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("Current sale preference error" + error)
  }
}

async function setSalePending(salesrep_id, sale_preference, inv_id, account_id, phone, sale_status) {
  try {
    const sql = "INSERT INTO sales_processing (salesrep_id, sale_preference, inv_id, account_id, phone, sale_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
    let queryResult = await pool.query(sql, [salesrep_id, sale_preference, inv_id, account_id, phone, sale_status])
    return queryResult
  } catch (error) {
    return error.message
  }
}

module.exports = {setSalePending, vehicleForSale, currentSalesRep, getSalesPeople, currentSalePreference}