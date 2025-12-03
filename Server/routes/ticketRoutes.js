import express from "express";
import {
  createTicket,
  getTickets,
  getTicket,
  assignTicket,
  updateStatus,
  ticketReply,
  getAssignedTickets,
} from "../controllers/ticketController.js";
import auth from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public creation from landing page
router.post("/public", createTicket);

// Protected routes
router.get("/", auth, getTickets);
router.get("/assigned", auth, getAssignedTickets);
router.get("/:id", auth, getTicket);
router.post("/:ticketId/assign", auth, requireAdmin, assignTicket);
router.post("/:ticketId/status", auth, updateStatus);


// Replying for ticket #Admin or Teammate
router.post("/:ticketId/messages",auth,ticketReply);


export default router;
