import React, { useEffect, useState } from "react";
import "./UserManagement.css";
import { Icon } from "@iconify/react";
import editIcon from "@iconify/icons-material-symbols/edit";
import deleteIcon from "@iconify/icons-material-symbols/delete";
import axios from "axios";

export default function TeamManagement() {
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const resUsers = await axios.get("https://mini-chat-bot-sv7z.onrender.com/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(resUsers.data || []);

        const resMe = await axios.get("https://mini-chat-bot-sv7z.onrender.com/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedUser(resMe.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You do not have permission to view users.");
        } else {
          setError("Failed to load users. Please try again later.");
        }
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="user-loading">Loading...</p>;
  if (error) return <p className="user-error-message">{error}</p>;
  if (!loggedUser) return null;

  const admin = users.find((u) => u.role === "admin");
  const regularUsers = users.filter((u) => u.role !== "admin");
  const orderedUsers = admin ? [admin, ...regularUsers] : regularUsers;

  return (
    <div className="user-user-page">
      <h2 className="user-user-title">Users</h2>

      <div className="user-user-table">
        <div className="user-table-row user-header">
          <span className="user-col-avatar"></span>
          <span className="user-col-name">Name</span>
          <span className="user-col-phone">Phone</span>
          <span className="user-col-email">Email</span>
          <span className="user-col-role">Role</span>
          <span className="user-col-actions"></span>
        </div>

        {orderedUsers.map((user) => {
          const name = `${user.firstname || ""} ${user.lastname || ""}`.trim() || "—";
          const initials = (user.firstname || user.email || "??").slice(0, 2).toUpperCase();

          const isLoggedUser =
            loggedUser?._id && user?._id
              ? loggedUser._id.toString().trim() === user._id.toString().trim()
              : false;

          return (
            <div className="user-table-row" key={user._id || Math.random()}>
              <div className="user-row-left">
                <span className="user-col-avatar">
                  <div className="user-avatar-initials">{initials}</div>
                </span>

                <span className="user-col-name">{name}</span>
                <span className="user-col-phone">{user.phone || "—"}</span>
                <span className="user-col-email">{user.email || "—"}</span>

                <span className="user-col-role">
                  <span
                    className={
                      user.role === "admin" ? "user-role-admin" : "user-role-member"
                    }
                  >
                    {user.role || "—"}
                  </span>
                </span>
              </div>

              <div className="user-row-right">
                {isLoggedUser ? (
                  <div className="user-action-buttons">
                    <Icon icon={editIcon} className="user-edit-btn" />
                    <Icon icon={deleteIcon} className="user-delete-btn" />
                  </div>
                ) : (
                  <span className="user-no-actions"></span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
