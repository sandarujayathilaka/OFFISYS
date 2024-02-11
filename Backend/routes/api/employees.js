const express = require("express");
const router = express.Router();
const employeesController = require("../../controller/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.delete(
  "/deleteemp/:id",
  verifyRoles(ROLES_LIST.Admin),
  employeesController.deleteEmployee
);

router.put(
  "/updatesub/:index/:id",
  verifyRoles(ROLES_LIST.Admin),
  employeesController.updateSubject
);

router.get('/getemp',verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Divisional_Secretariat,ROLES_LIST.Assistant_Director,ROLES_LIST.Assistant_District_Registar,ROLES_LIST.Cheif_Clerk,ROLES_LIST.Accountant,ROLES_LIST.Administrative_Officer), employeesController.getAllEmployees)

router.delete(
  "/deletesub/:index/:id",
  verifyRoles(ROLES_LIST.Admin),
  employeesController.deleteSub
);

//add new records to subjects and reports in admin
router.put(
  "/addsub/:id",
  verifyRoles(ROLES_LIST.Admin),
  employeesController.addSub
);
router.post(
  "/addemp",
  verifyRoles(ROLES_LIST.Admin),
  employeesController.createNewEmployee
);


router.get("/getoneemp/:id", employeesController.getEmployee);

router
  .route("/updatedate/date/:id/:reportId")
  .put(verifyRoles(ROLES_LIST.Employee), employeesController.ReportDate);

router.get(
  "/getdepemp/:dep",
  verifyRoles(ROLES_LIST.Divisional_Secretariat, ROLES_LIST.Assistant_Director,ROLES_LIST.Accountant,ROLES_LIST.Administrative_Officer,ROLES_LIST.Assistant_District_Registar,ROLES_LIST.Cheif_Clerk),
  employeesController.getDepartmentEmp
);


module.exports = router;
