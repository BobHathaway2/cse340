const pool = require("../database/");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* *****************************
*   Test for login credentials
* *************************** */
  
  async function loginAccount(account_email, account_password) {
    try {
      const sql = "SELECT account_email FROM account WHERE account_email = $1 && account_password = $2)"
      return await pool.query(sql, [account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching id found")
  }
}


  /* **********************
 *   Check for existing email
 * ********************* */
  async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }
  

  /* **********************
 *   Check for existing email except this account id
 * ********************* */
  async function checkExistingEmailExcept(account_email, account_id){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2"
      const email = await pool.query(sql, [account_email, account_id])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }


/* **********************
 *   Update Account
 * ********************* */
async function updateAccount(account_id, account_firstname, account_lastname, account_email){
  try {
    const sql = "update account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1"
    return await pool.query(sql, [account_id, account_firstname, account_lastname, account_email])
  } catch (error) {
    return error.message
  }
}

/* **********************
*   Update Account Password
* ********************* */
async function updatePassword(account_id, account_password){
 try {
   const sql = "update account SET account_password = $2 WHERE account_id = $1"
   return await pool.query(sql, [account_id, account_password])
 } catch (error) {
   return error.message
 }
}

/* *****************************
* Return account sale representitives
* ***************************** */
async function getSalesreps () {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname FROM account WHERE account_type = "sales"',
      [account_id])
    return result
  } catch (error) {
    return new Error("No matching id found")
  }
}


module.exports = {registerAccount, checkExistingEmail, loginAccount, getAccountByEmail, getAccountById, checkExistingEmailExcept, updateAccount, updatePassword}
