import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import infoIcon from "@iconify/icons-mdi/information";
import useLogout from "../../../hooks/useLogout";
import "./UserSettings.css";

export default function UserSettings() {
  const { logout } = useLogout();

  const [userSettings, setUserSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    initialMessage: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const update = (key, value) =>
    setUserSettings((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://mini-chat-bot-sv7z.onrender.com/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserSettings({
          firstName: res.data.firstname || "",
          lastName: res.data.lastname || "",
          email: res.data.email || "",
          initialMessage: res.data.initialMessage || "",
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const payload = {
        firstname: userSettings.firstName,
        lastname: userSettings.lastName,
        initialMessage: userSettings.initialMessage,
      };

      if (userSettings.password) {
        payload.password = userSettings.password;
        payload.confirmPassword = userSettings.confirmPassword;
      }

      await axios.put("https://mini-chat-bot-sv7z.onrender.com/api/auth/user", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Details updated successfully. You will be logged out.");
      logout();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-settings-container">
      <h3>Settings</h3>

      <div className="user-settings-section">
        <h4>Edit Profile</h4>
        <hr />

        <div className="user-settings-form">
          <label>First Name</label>
          <input
            type="text"
            value={userSettings.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />

          <label>Last Name</label>
          <input
            type="text"
            value={userSettings.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />

          <label>Email</label>
          <div className="user-input-with-icon">
            <input type="email" value={userSettings.email} disabled />
            <Icon icon={infoIcon} className="user-info-icon" />
          </div>

          <label>New Password</label>
          <div className="user-input-with-icon">
            <input
              type="password"
              value={userSettings.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Enter new password"
            />
            <Icon icon={infoIcon} className="user-info-icon" />
          </div>

          <label>Confirm Password</label>
          <div className="user-input-with-icon">
            <input
              type="password"
              value={userSettings.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Confirm new password"
            />
            <Icon icon={infoIcon} className="user-info-icon" />
          </div>
        </div>
      </div>

      <button className="user-settings-save-btn" onClick={handleUpdate}>
        Save
      </button>
    </div>
  );
}
