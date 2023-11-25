// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagement));


// Route to add new class view
router.get("/addClass", utilities.handleErrors(invController.buildAddClass));

// Process new classification
router.post(
    "/addNewClass",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  )

// Route to add new vehicle view
router.get("/addVehicle", utilities.handleErrors(invController.buildAddVehicle));

module.exports = router;