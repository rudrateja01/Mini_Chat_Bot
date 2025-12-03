import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import generateTicketId from "../utils/generateTicketId.js";

// Create a ticket from public form
export const createTicket = async (req, res) => {
  try {
    const { name, email, phone, initialMessage } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name & email are required" });
    }

    // Find admin to assign by default
    const admin = await User.findOne({ role: "admin" });
    if (!admin) return res.status(500).json({ message: "No admin found" });

    const ticketId = generateTicketId();
    const ticket = await Ticket.create({
      ticketId,
      user: { name, email, phone },
      assignedTo: admin._id,
    });

    if (initialMessage) {
      const msg = await Message.create({
        ticketId: ticket._id,
        text: initialMessage,
      });
      ticket.messages.push(msg._id);
      await ticket.save();
    }

    res.json({ message: "Ticket created", ticketId });
  } catch (error) {
    console.error("createTicket error:", error);
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
};

// Get all tickets (admin only)
export const getTickets = async (req, res) => {
  try {
    // if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });

    const tickets = await Ticket.find()
      .populate("assignedTo", "name email")
      .populate({
        path: "messages",
        select: "text senderId timestamp",
        populate: { path: "senderId", select: "name" },
      })
      .sort({ updatedAt: -1 });

    res.json({ tickets });
  } catch (error) {
    console.error("getTickets error:", error);
    res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
  }
};

// Get single ticket by ticketId
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id })
      .populate("assignedTo", "name email")
      .populate({
        path: "messages",
        select: "text senderId timestamp",
        populate: { path: "senderId", select: "name" },
      });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const formattedMessages = ticket.messages.map(msg => ({
      text: msg.text,
      timestamp: msg.timestamp,
    }));

    res.json({ ...ticket.toObject(), messages: formattedMessages });
  } catch (error) {
    console.error("getTicket error:", error);
    res.status(500).json({ message: "Failed to fetch ticket", error: error.message });
  }
};

// Assign a ticket to a user (admin only)
export const assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedId } = req.body;

    if (!assignedId) return res.status(400).json({ message: "assignedId is required" });

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const user = await User.findById(assignedId);
    if (!user) return res.status(404).json({ message: "User not found" });

    ticket.assignedTo = user._id;
    ticket.assignedToName = `${user.firstname} ${user.lastname}`;
    await ticket.save();

    res.json({
      message: "Ticket assigned successfully",
      ticket: {
        ticketId: ticket.ticketId,
        assignedTo: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
        status: ticket.status,
      },
    });
  } catch (error) {
    console.error("assignTicket error:", error);
    res.status(500).json({ message: "Failed to assign ticket", error: error.message });
  }
};

// Update ticket status
export const updateStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = status;
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.json({ message: "Ticket status updated", ticket });
  } catch (error) {
    console.error("updateStatus error:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

// Ticket Reply
export const ticketReply =  async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const sender = req.user.role === "admin" ? "admin" : "user";
    const message = await Message.create({
      ticketId: ticket._id,
      text,
      sender,
    });

    ticket.messages.push(message._id);
    await ticket.save();

    res.json({ message: "Message added", ticket });
  } catch (err) {
    console.error("Add message error:", err);
    res.status(500).json({ message: "Failed to add message", error: err.message });
  }
}

// getAssignedTickets for user
export const getAssignedTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find({ assignedTo: userId })
      .populate("assignedTo", "name email")
      .populate({
        path: "messages",
        select: "text senderId timestamp",
        populate: { path: "senderId", select: "name" },
      })
      .sort({ updatedAt: -1 });

    res.json({ tickets });
  } catch (error) {
    console.error("Assigned Tickets Error:", error);
    res.status(500).json({ message: "Failed to fetch assigned tickets" });
  }
};
