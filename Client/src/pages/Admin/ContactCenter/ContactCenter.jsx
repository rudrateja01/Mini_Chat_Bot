import React, { useEffect, useState } from "react";
import { useChat } from "../../../context/ChatContext";
import "./ContactCenter.css";
import { Icon } from "@iconify/react";
import homeIcon from "@iconify/icons-mdi/home";
import sendIcon from "@iconify/icons-mdi/send";

export default function ContactCenter() {
  const { tickets, setTickets, selectedTicket, loading, selectTicket } =
    useChat();

  const [replyText, setReplyText] = useState("");
  const [teammates, setTeammates] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [assignedTeammate, setAssignedTeammate] = useState(null);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [pendingTeammate, setPendingTeammate] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://mini-chat-bot-sv7z.onrender.com/api/auth/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        const teammatesList = (Array.isArray(data) ? data : [])
          .filter((u) => u._id !== loggedUser._id)
          .filter((u) => u.role !== "user");

        setTeammates(teammatesList);
        if (teammatesList.length > 0) {
          setAssignedTeammate(teammatesList[0]);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
        setTeammates([]);
      }
    };

    loadUsers();
  }, [loggedUser._id]);

  const handleAssignConfirm = async () => {
    if (!selectedTicket || !pendingTeammate) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://mini-chat-bot-sv7z.onrender.com/api/tickets/${selectedTicket.ticketId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assignedId: pendingTeammate._id }),
        }
      );

      const data = await res.json();
      setAssignedTeammate(pendingTeammate);
      console.log("Assigned :", pendingTeammate);
      setShowAssignPopup(false);

      if (
        data.ticket.assignedTo.id !==
        JSON.parse(localStorage.getItem("user"))._id
      ) {
        setRestricted(true);
      }

      selectTicket({ ...selectedTicket, assignedTo: pendingTeammate });
    } catch (err) {
      console.error("Failed to assign teammate:", err);
    }
  };

  // refresh tickets
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://mini-chat-bot-sv7z.onrender.com/api/tickets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setTickets(data);
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
        selectTicket(data.ticket);
      }

      setShowStatusPopup(false);

      const currentUserId = JSON.parse(localStorage.getItem("user"))._id;
      setRestricted(
        data.ticket.assignedTo?._id &&
          data.ticket.assignedTo._id !== currentUserId
      );
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
    <div className="cc-root">
      {/* LEFT PANEL */}
      <div className="cc-left">
        <p id="page">Contact Center</p>
        <span>Chats</span>
        <hr />
        {loading && <p>Loading chats...</p>}
        {!loading && (!Array.isArray(tickets) || tickets.length === 0) && (
          <p>No chats found.</p>
        )}

        {Array.isArray(tickets) &&
          tickets
            .filter(
              (t) =>
                t.status === "open" &&
                (t.assignedTo?._id === loggedUser.id ||
                  t.assignedTo?._id === loggedUser._id)
            )
            .map((t, idx) => {
              const nameParts = t.user?.name?.split(" ") || [];
              const avatarText = (
                (nameParts[0]?.[0] || "") + (nameParts[1]?.[0] || "")
              ).toUpperCase();

              return (
                <div
                  key={t._id}
                  className={`cc-chat-item ${
                    selectedTicket?._id === t._id ? "active" : ""
                  }`}
                  onClick={() => {
                    selectTicket(t);
                    setRestricted(false);
                  }}
                >
                  <div className="cc-chat-avatar">{avatarText}</div>
                  <div className="cc-chat-info">
                    <p className="cc-chat-title">Chat {idx + 1}</p>
                    <p className="cc-chat-preview">{latestMessage(t)}</p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* CENTER PANEL */}
      <div className="cc-center">
        {selectedTicket ? (
          <>
            <div className="cc-center-header">
              <span className="ticket-id">
                Ticket: {selectedTicket.ticketId}
              </span>
              <Icon icon={homeIcon} className="home-icon" />
            </div>

            {/* ================= RESTRICTED POPUP ================= */}
            {restricted && (
              <div className="cc-restricted-popup">
                <p>
                  This chat is assigned to another team member. You no longer
                  have access.
                </p>
                <button
                  className="cc-restricted-close-btn"
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
            <div className="cc-chat-messages">
              {(selectedTicket.messages || []).length === 0 ? (
                <p className="no-messages">No messages yet</p>
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
                        <div className="chat-date-divider">{msgDate}</div>
                      )}

                      <div
                        className={`chat-msg-wrapper ${
                          isAdmin ? "chat-sent" : "chat-received"
                        }`}
                      >
                        {isAdmin ? (
                          <>
                            <div className="chat-msg-content">
                              <p className="chat-sender-name">You</p>
                              <p className={`chat-msg sent`}>{msg.text}</p>
                            </div>
                            <div className="chat-avatar">RT</div>
                          </>
                        ) : (
                          <>
                            <div className="chat-avatar">{avatarText}</div>
                            <div className="chat-msg-content">
                              <p className="chat-index">User</p>
                              <p className={`chat-msg received`}>{msg.text}</p>
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
            <div className="cc-chat-input">
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
                className="send-icon"
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
          <p className="cc-empty">Select a chat to view messages</p>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="cc-right">
        <div className="cc-right-scroll">
          <div className="cc-header">
            <div className="cc-avatar-big">
              {(selectedTicket?.user?.name || "NA")
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <h3 className="cc-chat-label">Chat</h3>
          </div>

          <h2 className="cc-title">Details</h2>
          <div className="cc-section-details">
            <div className="detail-box">
              <Icon icon="mdi:account" className="detail-icon" />
              <span>{selectedTicket?.user?.name || "N/A"}</span>
            </div>
            <div className="detail-box">
              <Icon icon="mdi:phone" className="detail-icon" />
              <span>+91{selectedTicket?.user?.phone || "N/A"}</span>
            </div>
            <div className="detail-box">
              <Icon icon="mdi:email" className="detail-icon" />
              <span>{selectedTicket?.user?.email || "N/A"}</span>
            </div>
          </div>

          {/* ================= TEAMMATES ================= */}
          <h2 className="cc-title">Teammates</h2>
          <div
            className="cc-teammate-row"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="cc-teammate-left">
              <div className="cc-avatar-small">
                {assignedTeammate
                  ? `${assignedTeammate.firstname?.charAt(0) || ""}${
                      assignedTeammate.lastname?.charAt(0) || ""
                    }`.toUpperCase()
                  : "NA"}
              </div>
              <p className="cc-teammate-name">
                {assignedTeammate
                  ? `${assignedTeammate.firstname} ${assignedTeammate.lastname}`
                  : "Select User"}
              </p>
            </div>
            <div className="cc-teammate-dropdown-btn">
              <Icon icon="mdi:chevron-down" />
            </div>
          </div>

          {dropdownOpen && (
            <div className="cc-teammate-dropdown">
              {teammates.length > 0 ? (
                teammates.map((u) => (
                  <div
                    key={u._id}
                    className="dropdown-option"
                    onClick={() => {
                      setPendingTeammate(u);
                      setShowAssignPopup(true);
                      setDropdownOpen(false);
                    }}
                  >
                    <div className="cc-avatar-small">
                      {(u.firstname?.charAt(0) || "").toUpperCase()}
                      {(u.lastname?.charAt(0) || "").toUpperCase()}
                    </div>
                    <div className="dropdown-info">
                      <span className="dropdown-name">
                        {u.firstname} {u.lastname}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dropdown-option">No teammates found</div>
              )}
            </div>
          )}

          {/* ================= TICKET STATUS ================= */}
          <div className="cc-ticket-status-container">
            <div className="cc-ticket-status-box">
              <div className="cc-ticket-status-left">
                <Icon icon="mdi:ticket" className="cc-status-icon" />
                <h2 className="cc-title">Ticket Status</h2>
              </div>
              <div
                className="cc-ticket-status-right"
                onClick={() => setStatusOpen((prev) => !prev)}
              >
                <Icon icon="mdi:chevron-down" />
              </div>
            </div>

            {statusOpen && (
              <div className="cc-status-dropdown">
                <div
                  className={`cc-status-option ${
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
                  className={`cc-status-option ${
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

      {/* ================= ASSIGN POPUP ================= */}
      {showAssignPopup && (
        <div className="cc-popup-overlay">
          <div className="cc-popup">
            <p>Chat will be assigned to a different team member.</p>
            <div className="popup-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowAssignPopup(false)}
              >
                Cancel
              </button>
              <button className="submit-btn" onClick={handleAssignConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STATUS POPUP ================= */}
      {showStatusPopup && (
        <div className="cc-popup-overlay">
          <div className="cc-popup">
            <p>Chat will be closed.</p>
            <div className="popup-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowStatusPopup(false)}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={() => handleStatusConfirm(pendingStatus)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
