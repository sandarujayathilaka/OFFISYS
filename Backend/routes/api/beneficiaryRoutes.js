const express = require('express');
const router = express.Router();
const beneficiaryController = require('../../controller/benController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.get(
  "/getonetask/:id",
  verifyRoles(ROLES_LIST.Employee),
  beneficiaryController.getTask
);

router.get(
  "/emp/:id",
  verifyRoles(ROLES_LIST.Employee),
  beneficiaryController.getEmployee
);

router.get(
  "/sub/:id/:sid",
  verifyRoles(ROLES_LIST.Employee),
  beneficiaryController.getSubTasks
);

router.get(
  "/getallcases",
  verifyRoles(ROLES_LIST.Divisional_Secretariat),
  beneficiaryController.getAllCases
);

router.put(
  "/penupdate/:id",
  verifyRoles(ROLES_LIST.Employee),
  beneficiaryController.pendingUpdate
);

router.delete(
  "/deletetask/:id",
  verifyRoles(ROLES_LIST.Employee),
  beneficiaryController.deleteTask
);

router
  .route("/addben")
  .post(verifyRoles(ROLES_LIST.Employee), beneficiaryController.caseRegister);

router.route("/getall/:empId").get(beneficiaryController.getAllTasks);

router.route("/getall").get(beneficiaryController.getTasks);

module.exports = router;








