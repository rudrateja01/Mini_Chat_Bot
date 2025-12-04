import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all"); 
  const limit = 8;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.token) return;

        const res = await axios.get("https://mini-chat-bot-sv7z.onrender.com/api/tickets", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const ticketList = res.data.tickets || [];
        setTickets(ticketList);
        setFiltered(ticketList);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchTickets();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFiltered(tickets);
      return;
    }

    const result = tickets.filter(
      (t) => t.ticketId.toLowerCase() === search.toLowerCase()
    );

    setFiltered(result);
    setPage(1);
  };

  const applyFilter = (status) => {
  setActiveFilter(status);
  setPage(1);

  if (status === "all") {
    setFiltered(tickets);
  } else if (status === "unresolved") {
    setFiltered(
      tickets.filter((t) => t.status === "unresolved" || !t.status)
    );
  } else {
    setFiltered(tickets.filter((t) => t.status === status));
  }
};

  const startIndex = (page - 1) * limit;
  const paginatedTickets = filtered.slice(startIndex, startIndex + limit);

  const getAvatar = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="dashboard-root">
      <p id="page">Dashboard</p>
      <div className="search-row">
        <input
          type="text"
          placeholder="Search for Ticket"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="metric-grid">
        <div
          className={`metric-card all ${
            activeFilter === "all" ? "active" : ""
          }`}
          onClick={() => applyFilter("all")}
        >
          <h3>All Tickets</h3>
        </div>
        <div
          className={`metric-card resolved ${
            activeFilter === "resolved" ? "active" : ""
          }`}
          onClick={() => applyFilter("resolved")}
        >
          <h3>Resolved</h3>
        </div>
        <div
          className={`metric-card unresolved ${
            activeFilter === "unresolved" ? "active" : ""
          }`}
          onClick={() => applyFilter("unresolved")}
        >
          <h3>Unresolved</h3>
        </div>
      </div>

      <hr />

      {filtered.length === 0 ? (
        <p className="empty">No tickets found</p>
      ) : (
        <div className="ticket-container">
          {paginatedTickets.map((t, idx) => (
            <div className="ticket-card" key={idx}>
              <div className="ticket-header">
                <h3 className="ticket-id">Ticket: {t.ticketId}</h3>
                <span className="ticket-time">
                  Posted at{" "}
                  {new Date(t.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>

              <p className="ticket-message">
                {t.messages[0]?.text || "No message yet"}
              </p>
              <hr />

              <div className="ticket-top">
                <div className="ticket-user-wrapper">
                  {/* Avatar */}
                  <div className="ticket-avatar">{getAvatar(t.user?.name)}</div>

                  {/* Userdetails */}
                  <div className="ticket-user">
                    <p id="username">{t.user?.name}</p>
                    <p>{t.user?.email}</p>
                    <p>+91{t.user?.phone}</p>
                  </div>
                </div>
                <h2 className="open-ticket-text">Open Ticket</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
