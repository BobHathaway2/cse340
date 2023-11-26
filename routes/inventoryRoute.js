// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/addClass", utilities.handleErrors(invController.buildAddClass));

// Route to build add inventory view
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory));

// Process new classification
router.post(
    "/addNewClass",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  )

module.exports = router;