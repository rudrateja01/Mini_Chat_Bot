import express from "express";
import {addMessage,getMessagesForTicket} from "../controllers/messageController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Post message for ticket
router.post("/:ticketId/message", auth, addMessage);
router.get("/:ticketId", auth, getMessagesForTicket);

export default router;
