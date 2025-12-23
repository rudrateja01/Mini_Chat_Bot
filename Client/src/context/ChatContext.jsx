import React, { createContext, useState, useEffect, useContext } from "react";

const API_BASE = "https://mini-chat-bot-ax9y.onrender.com/api";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : data.tickets || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const selectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const sendMessage = async (text) => {
    if (!selectedTicket || !text.trim()) return;

    const newMsg = {
      text,
      sender: "admin",
      createdAt: new Date().toISOString(),
    };

    setSelectedTicket((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg],
    }));

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
        loading,
        setLoading,
        loadTickets,
        selectTicket,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
