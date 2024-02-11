const express = require("express");
const router = express.Router();
const subjectController = require("../../controller/subjectController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.delete(
  "/deletesubject/:id",
  verifyRoles(ROLES_LIST.Admin),
  subjectController.deleteSubject
);
router.put(
  "/updatetask/:index/:id",
  verifyRoles(ROLES_LIST.Admin),
  subjectController.updateTask
);

router.delete(
  "/deletetask/:index/:id",
  verifyRoles(ROLES_LIST.Admin),
  subjectController.deleteTask
);
router.put(
  "/addtask/:id",
  verifyRoles(ROLES_LIST.Admin),
  subjectController.addNew
);

router.post(
  "/addsubject",
  verifyRoles(ROLES_LIST.Admin),
  subjectController.createNewSubject
);

router.get(
  "/getsubject",
  verifyRoles(ROLES_LIST.Admin),
  subjectController.getAllSubjects
);

router.route("/getonesubject/:id").get(subjectController.getSubject);

module.exports = router;
