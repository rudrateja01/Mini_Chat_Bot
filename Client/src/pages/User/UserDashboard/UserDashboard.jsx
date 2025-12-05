import "./UserDashboard.css"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
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

        const res = await axios.get("https://mini-chat-bot-ax9y.onrender.com/api/tickets/assigned", {
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
    <div className="user-dashboard-root">
      <p id="user-page">User Dashboard</p>

      <div className="user-search-row">
        <input
          type="text"
          placeholder="Search for Ticket"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="user-metric-grid">
        <div
          className={`user-metric-card user-all ${
            activeFilter === "all" ? "user-active" : ""
          }`}
          onClick={() => applyFilter("all")}
        >
          <h3>All Tickets</h3>
        </div>

        <div
          className={`user-metric-card user-resolved ${
            activeFilter === "resolved" ? "user-active" : ""
          }`}
          onClick={() => applyFilter("resolved")}
        >
          <h3>Resolved</h3>
        </div>

        <div
          className={`user-metric-card user-unresolved ${
            activeFilter === "unresolved" ? "user-active" : ""
          }`}
          onClick={() => applyFilter("unresolved")}
        >
          <h3>Unresolved</h3>
        </div>
      </div>

      <hr />

      {filtered.length === 0 ? (
        <p className="user-empty">No tickets found</p>
      ) : (
        <div className="user-ticket-container">
          {paginatedTickets.map((t, idx) => (
            <div className="user-ticket-card" key={idx}>
              <div className="user-ticket-header">
                <h3 className="user-ticket-id">Ticket: {t.ticketId}</h3>
                <span className="user-ticket-time">
                  Posted at{" "}
                  {new Date(t.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>

              <p className="user-ticket-message">
                {t.messages[0]?.text || "No message yet"}
              </p>

              <hr />

              <div className="user-ticket-top">
                <div className="user-ticket-user-wrapper">
                  <div className="user-ticket-avatar">
                    {getAvatar(t.user?.name)}
                  </div>

                  <div className="user-ticket-user">
                    <p id="user-username">{t.user?.name}</p>
                    <p>{t.user?.email}</p>
                    <p>+91{t.user?.phone}</p>
                  </div>
                </div>

                <h2 className="user-open-ticket-text">Open Ticket</h2>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > limit && (
        <div className="user-pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>Page {page}</span>
          <button
            disabled={startIndex + limit >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

