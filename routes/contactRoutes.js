const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  deleteContact,
  updateContact,
} = require("../controllers/contactControllers");
const validatetoken = require("../middleware/validateTokenHandler");

router.use(validatetoken);

router.route("/").get(getContacts);

router.route("/").post(createContact);

router.route("/:id").get(getContact);

router.route("/:id").delete(deleteContact);

router.route("/:id").put(updateContact);

module.exports = router;
