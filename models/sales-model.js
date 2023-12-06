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


