import React from 'react';
import "./UserControlCenter.css"
import  { useEffect, useState } from "react";
import { useChat } from "../../../context/ChatContext";
import { Icon } from "@iconify/react";
import homeIcon from "@iconify/icons-mdi/home";
import sendIcon from "@iconify/icons-mdi/send";

export default function UserContactCenter() {
  const { tickets, setTickets, selectedTicket, loading, selectTicket } =
    useChat();

  const [replyText, setReplyText] = useState("");
  const [teammates, setTeammates] = useState([]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [assignedTeammate, setAssignedTeammate] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [restricted, setRestricted] = useState(false);
  
  // 1. Get the current user ID once
  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://mini-chat-bot-sv7z.onrender.com/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setTeammates(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0) {
          setAssignedTeammate(data[0]);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
        setTeammates([]);
      }
    };

    loadUsers();
  }, []);

  // refresh tickets
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://mini-chat-bot-sv7z.onrender.com/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusConfirm = async () => {
    if (!selectedTicket || !pendingStatus) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://mini-chat-bot-sv7z.onrender.com/api/tickets/${selectedTicket.ticketId}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: pendingStatus }),
        }
      );

      const data = await res.json();
      console.log("Status API response:", data);

      if (!data.ticket) {
        console.error("No ticket returned from status API:", data);
        setShowStatusPopup(false);
        return;
      }

      // Update tickets locally
      setTickets((prevTickets) =>
        prevTickets.map((t) => (t._id === data.ticket._id ? data.ticket : t))
      );

      if (data.ticket.status.toLowerCase() !== "open") {
        selectTicket(null);
      } else {
        selectTicket(data.ticket); // Keep selected ticket if still open
      }

      setShowStatusPopup(false);

      // We already have currentUserId, so we can use it here directly
      setRestricted(
        data.ticket.assignedTo?._id &&
          data.ticket.assignedTo._id !== currentUserId
      );
      fetchTickets();
    } catch (err) {
      console.error("Failed to update status:", err);
      setShowStatusPopup(false);
      selectTicket(null);
    }
  };

  const latestMessage = (ticket) =>
    ticket.messages?.length
      ? ticket.messages[ticket.messages.length - 1].text.slice(0, 30) + "..."
      : "No messages yet";

      const loggedUser = JSON.parse(localStorage.getItem("user"));


  return (
    <div className="user-cc-root">
      {/* LEFT PANEL */}
      <div className="user-cc-left">
        <p id="page">Contact Center</p>
        <span>Chats</span>
        <hr />
        {loading && <p>Loading chats...</p>}
        {!loading && (!Array.isArray(tickets) || tickets.length === 0) && (
          <p>No chats found.</p>
        )}

        {Array.isArray(tickets) &&
          tickets
            .filter((t) => t.status === "open" && 
       (t.assignedTo === loggedUser.id || t.assignedTo?._id === loggedUser.id))
            .map((t, idx) => {
              const nameParts = t.user?.name?.split(" ") || [];
              const avatarText = (
                (nameParts[0]?.[0] || "") + (nameParts[1]?.[0] || "")
              ).toUpperCase();

              return (
                <div
                  key={t._id}
                  className={`user-cc-chat-item ${
                    selectedTicket?._id === t._id ? "active" : ""
                  }`}
                  onClick={() => {
                    selectTicket(t);
                    setRestricted(false);
                  }}
                >
                  <div className="user-cc-chat-avatar">{avatarText}</div>
                  <div className="user-cc-chat-info">
                    <p className="user-cc-chat-title">Chat {idx + 1}</p>
                    <p className="user-cc-chat-preview">{latestMessage(t)}</p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* CENTER PANEL */}
      <div className="user-cc-center">
        {selectedTicket ? (
          <>
            <div className="user-cc-center-header">
              <span className="user-ticket-id">
                Ticket: {selectedTicket.ticketId}
              </span>
              <Icon icon={homeIcon} className="user-home-icon" />
            </div>

            {/* ================= RESTRICTED POPUP ================= */}
            {restricted && (
              <div className="user-cc-restricted-popup">
                <p>
                  This chat is assigned to another team member. You no longer
                  have access.
                </p>
                <button
                  className="user-cc-restricted-close-btn"
                  onClick={() => {
                    setRestricted(false);
                    selectTicket(null);
                  }}
                >
                  OK
                </button>
              </div>
            )}

            {/* CHAT MESSAGES */}
            <div className="user-cc-chat-messages">
              {(selectedTicket.messages || []).length === 0 ? (
                <p className="user-no-messages">No messages yet</p>
              ) : (
                (selectedTicket.messages || []).map((msg, idx) => {
                  const isAdmin = msg.sender === "admin";
                  const nameParts = selectedTicket.user?.name?.split(" ") || [];
                  const avatarText = (
                    (nameParts[0]?.[0] || "") + (nameParts[1]?.[0] || "")
                  ).toUpperCase();

                  const rawDate = msg.createdAt
                    ? new Date(msg.createdAt)
                    : new Date();
                  const msgDate = rawDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  const prevMsg = selectedTicket.messages[idx - 1];
                  const prevDate = prevMsg
                    ? new Date(prevMsg.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : null;

                  return (
                    <React.Fragment key={idx}>
                      {msgDate !== prevDate && (
                        <div className="user-chat-date-divider">{msgDate}</div>
                      )}

                      <div
                        className={`user-chat-msg-wrapper ${
                          isAdmin ? "user-chat-sent" : "user-chat-received"
                        }`}
                      >
                        {isAdmin ? (
                          <>
                            <div className="user-chat-msg-content">
                              <p className="user-chat-sender-name">You</p>
                              <p className={`user-chat-msg user-sent`}>{msg.text}</p>
                            </div>
                            <div className="user-chat-avatar">RT</div>
                          </>
                        ) : (
                          <>
                            <div className="user-chat-avatar">{avatarText}</div>
                            <div className="user-chat-msg-content">
                              <p className="user-chat-index">User</p>
                              <p className={`user-chat-msg user-received`}>{msg.text}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* INPUT BOX */}
            <div className="user-cc-chat-input">
              <textarea
                placeholder="Type here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey && replyText.trim()) {
                    e.preventDefault();

                    const newMessage = {
                      text: replyText,
                      sender: "admin",
                      createdAt: new Date().toISOString(),
                    };

                    selectTicket({
                      ...selectedTicket,
                      messages: [
                        ...(selectedTicket.messages || []),
                        newMessage,
                      ],
                    });

                    setReplyText("");

                    try {
                      const token = localStorage.getItem("token");
                      await fetch(
                        `https://mini-chat-bot-sv7z.onrender.com/api/messages/${selectedTicket.ticketId}/message`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ text: newMessage.text }),
                        }
                      );
                    } catch (err) {
                      console.error("Failed to send message:", err);
                    }
                  }
                }}
              />

              <span
                className="user-send-icon"
                onClick={async () => {
                  if (!replyText.trim()) return;

                  const newMessage = {
                    text: replyText,
                    sender: "admin",
                    createdAt: new Date().toISOString(),
                  };

                  selectTicket({
                    ...selectedTicket,
                    messages: [...(selectedTicket.messages || []), newMessage],
                  });

                  setReplyText("");

                  try {
                    const token = localStorage.getItem("token");
                    await fetch(
                      `https://mini-chat-bot-sv7z.onrender.com/api/messages/${selectedTicket.ticketId}/message`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ text: newMessage.text }),
                      }
                    );
                  } catch (err) {
                    console.error("Failed to send message:", err);
                  }
                }}
              >
                <Icon icon={sendIcon} width="20" height="20" />
              </span>
            </div>
          </>
        ) : (
          <p className="user-cc-empty">Select a chat to view messages</p>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="user-cc-right">
        <div className="user-cc-right-scroll">
          <div className="user-cc-header">
            <div className="user-cc-avatar-big">
              {(selectedTicket?.user?.name || "NA")
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <h3 className="user-cc-chat-label">Chat</h3>
          </div>

          <h2 className="user-cc-title">Details</h2>
          <div className="user-cc-section-details">
            <div className="user-detail-box">
              <Icon icon="mdi:account" className="user-detail-icon" />
              <span>{selectedTicket?.user?.name || "N/A"}</span>
            </div>
            <div className="user-detail-box">
              <Icon icon="mdi:phone" className="user-detail-icon" />
              <span>+91{selectedTicket?.user?.phone || "N/A"}</span>
            </div>
            <div className="user-detail-box">
              <Icon icon="mdi:email" className="user-detail-icon" />
              <span>{selectedTicket?.user?.email || "N/A"}</span>
            </div>
          </div>

          {/* Note: Teammates logic (dropdown, assignment) was removed from the provided JSX */}

          {/* ================= TICKET STATUS ================= */}
          <div className="user-cc-ticket-status-container">
            <div className="user-cc-ticket-status-box">
              <div className="user-cc-ticket-status-left">
                <Icon icon="mdi:ticket" className="user-cc-status-icon" />
                <h2 className="user-cc-title">Ticket Status</h2>
              </div>
              <div
                className="user-cc-ticket-status-right"
                onClick={() => setStatusOpen((prev) => !prev)}
              >
                <Icon icon="mdi:chevron-down" />
              </div>
            </div>

            {statusOpen && (
              <div className="user-cc-status-dropdown">
                <div
                  className={`user-cc-status-option ${
                    selectedTicket?.status === "resolved" ? "active" : ""
                  }`}
                  onClick={() => {
                    setPendingStatus("resolved");
                    setShowStatusPopup(true);
                    setStatusOpen(false);
                  }}
                >
                  Resolved
                </div>
                <hr />
                <div
                  className={`user-cc-status-option ${
                    selectedTicket?.status === "unresolved" ? "active" : ""
                  }`}
                  onClick={() => {
                    setPendingStatus("unresolved");
                    setShowStatusPopup(true);
                    setStatusOpen(false);
                  }}
                >
                  Unresolved
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= STATUS POPUP ================= */}
      {showStatusPopup && (
        <div className="user-cc-popup-overlay">
          <div className="user-cc-popup">
            <p>Chat will be closed.</p>
            <div className="user-popup-buttons">
              <button
                className="user-cancel-btn"
                onClick={() => setShowStatusPopup(false)}
              >
                Cancel
              </button>
              <button className="user-submit-btn" onClick={() => handleStatusConfirm(pendingStatus)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}