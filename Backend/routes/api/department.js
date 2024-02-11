const express = require("express");
const router = express.Router();
const departmentController = require("../../controller/departmentController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");


router.delete(
  "/deleteDep/:id",
  verifyRoles(ROLES_LIST.Admin),
  departmentController.deleteDepartment
);

router.put(
  "/updateDep/:id",
  verifyRoles(ROLES_LIST.Admin),
  departmentController.updateDepartment
);

router.post(
  "/addDep",
  verifyRoles(ROLES_LIST.Admin),
  departmentController.createNewDepartment
);

router.get(
  "/getdep",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Divisional_Secretariat),
  departmentController.getAllDepartment
);

router.get("/getOnedep/:id",verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Divisional_Secretariat), departmentController.getDepartment);

module.exports = router;
