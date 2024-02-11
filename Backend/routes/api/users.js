const express = require("express");
const router = express.Router();
const usersController = require("../../controller/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Employee),
    usersController.getAllUsers
  )
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
  .route("/:id")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Employee),
    usersController.getUser
  );

router
  .route("/:eid")
  .put(
    verifyRoles(
      ROLES_LIST.Admin,
      ROLES_LIST.Divisional_Secretariat,
      ROLES_LIST.Employee,
      ROLES_LIST.Assistant_Director,
      ROLES_LIST.Accountant,
      ROLES_LIST.Administrative_Officer,
      ROLES_LIST.Assistant_District_Registar,
      ROLES_LIST.Cheif_Clerk
    ),
    usersController.updateUser
  );

module.exports = router;
