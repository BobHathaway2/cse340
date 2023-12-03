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
router.get("/", utilities.checkManagement, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/addClass", utilities.checkManagement, utilities.handleErrors(invController.buildAddClass));

// Route to build add inventory view
router.get("/addInventory", utilities.checkManagement, utilities.handleErrors(invController.buildAddInventory));

// Route to get inventory in JSON format
router.get("/getInventory/:classification_id", utilities.checkManagement, utilities.handleErrors(invController.getInventoryJSON))

// Route to edit inventory
router.get("/edit/:inv_id", utilities.checkManagement, utilities.handleErrors(invController.editInventoryView))

// Route to delete inventory
router.get("/delete/:inv_id", utilities.checkManagement, utilities.handleErrors(invController.deleteInventoryView))


// Process new classification
router.post(
  "/addNewClass",
  utilities.checkManagement,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Process new classification
router.post(
  "/addInventory",
  utilities.checkManagement,
  validate.vehicleRules(),
  validate.checkVehicleData,
  utilities.handleErrors(invController.addInventory)
)

// Route to update inventory
router.post(
  "/update/",
  utilities.checkManagement,
  validate.vehicleRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

// Route to delete inventory
router.post(
  "/delete/",
  utilities.checkManagement,
  utilities.handleErrors(invController.deleteInventory))


module.exports = router;