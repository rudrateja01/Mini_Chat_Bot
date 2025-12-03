import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";

export const getAnalytics = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("messages");

    const totalChats = tickets.length;
    const resolvedCount = tickets.filter(t => t.status === "resolved").length;
    const resolvedPercent = totalChats === 0 
      ? 0 
      : Math.round((resolvedCount / totalChats) * 100);

    let totalReplyTime = 0;
    let count = 0;

    for (const ticket of tickets) {
      if (!ticket.messages || ticket.messages.length < 2) continue;

      const msgs = await Message.find({ _id: { $in: ticket.messages } })
        .sort({ timestamp: 1 });

      const firstMessage = msgs[0];
      const firstAdminReply = msgs.find(m => m.senderId !== null);

      if (firstMessage && firstAdminReply) {
        const diff = new Date(firstAdminReply.timestamp) - new Date(firstMessage.timestamp);
        totalReplyTime += diff;
        count++;
      }
    }

    const avgReplyTime =
      count === 0 ? 0 : Math.round((totalReplyTime / count) / 1000); // seconds

    const missingChatsHistory = [];

    const unresolvedTickets = tickets.filter(t => t.status === "unresolved");

    unresolvedTickets.forEach(ticket => {
      const weekNo = Math.ceil(new Date(ticket.createdAt).getDate() / 7);
      const label = `Week ${weekNo}`;

      const existing = missingChatsHistory.find(item => item.week === label);

      if (existing) {
        existing.count++;
      } else {
        missingChatsHistory.push({ week: label, count: 1 });
      }
    });

    res.json({
      success: true,
      analytics: {
        totalChats,
        resolvedPercent,
        avgReplyTime,
        missingChatsHistory,
      },
    });

  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ success: false, message: "Analytics error" });
  }
};
