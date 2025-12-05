import Message from "../models/Message.js";
import Ticket from "../models/Ticket.js";

// Add a message to a ticket
export const addMessage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const senderId = req.user ? req.user.id : null;
    const msg = await Message.create({
      ticketId: ticket._id,
      text,
      senderId,
    });

    ticket.messages.push(msg._id);
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.json({ message: "Message added", msg });
  } catch (err) {
    res.status(500).json({ message: "Failed to add message", error: err.message });
  }
};



// Get all messages for a ticket
export const getMessagesForTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({ ticketId }).populate({
      path: "messages",
      select: "text senderId timestamp",
      populate: { path: "senderId", select: "name" }
    });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const formattedMessages = ticket.messages.map(msg => ({
      text: msg.text,
      sender: msg.senderId ? msg.senderId.name : "Public User",
      timestamp: msg.timestamp
    }));

    res.json({ messages: formattedMessages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};
