const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateNoteBody, validateNoteId } = require("../middleware/validationMiddleware");

router.post("/", authMiddleware, validateNoteBody, noteController.createNote);
router.get("/", authMiddleware, noteController.getNotesByUser);
router.put("/:id", authMiddleware,validateNoteId, noteController.updateNote);
router.delete("/:id", authMiddleware,validateNoteId, noteController.deleteNote);

module.exports = router;