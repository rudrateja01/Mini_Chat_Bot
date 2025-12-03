import React, { createContext, useState, useEffect, useContext } from "react";

const API_BASE = "http://localhost:4000/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Make sure tickets is always an array
      setTickets(Array.isArray(data) ? data : data.tickets || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Select a ticket and load its messages
  const selectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setLoading(true);
    try {
      setMessages(ticket.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send a message to the selected ticket
  const sendMessage = async (text) => {
    if (!selectedTicket || !text.trim()) return;

    const newMsg = {
      text,
      sender: "admin",
      createdAt: new Date().toISOString(),
    };

    // UI update
    setMessages((prev) => [...prev, newMsg]);

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/tickets/${selectedTicket.ticketId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        tickets,
        setTickets,
        selectedTicket,
        messages,
        loading,
        loadTickets,
        selectTicket,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook
export const useChat = () => useContext(ChatContext);
