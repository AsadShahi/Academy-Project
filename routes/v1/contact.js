const express = require("express");
const contactsController = require("./../../controllers/v1/contact");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

// Get all contacts (requires auth and admin check)
router
    .route("/")
    .get(authMiddleware, isAdminMiddleware, contactsController.getAll);

// Create a contact (can be protected, add middlewares if needed)
router.route('/')
    .post(authMiddleware, isAdminMiddleware, contactsController.create);

// Remove a contact by ID (requires auth and admin check)
router
    .route("/:id")
    .delete(authMiddleware, isAdminMiddleware, contactsController.remove);

// Answer a contact request (requires auth and admin check)
router
    .route("/answer")
    .post(authMiddleware, isAdminMiddleware, contactsController.answer);

module.exports = router;
