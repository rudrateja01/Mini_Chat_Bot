import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import infoIcon from "@iconify/icons-mdi/information";
import useLogout from "../../../hooks/useLogout";
import "./Settings.css";

export default function Settings() {
  const { logout } = useLogout();

  const [settings, setSettings] = useState({
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
    setSettings((prev) => ({ ...prev, [key]: value }));

  // Fetch admin data
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("https://mini-chat-bot-sv7z.onrender.com/api/auth/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSettings({
          firstName: res.data.firstname || "",
          lastName: res.data.lastname || "",
          email: res.data.email || "",
          initialMessage: res.data.initialMessage || "",
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Failed to fetch admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const payload = {
        firstname: settings.firstName,
        lastname: settings.lastName,
        initialMessage: settings.initialMessage,
      };

      if (settings.password) {
        payload.password = settings.password;
        payload.confirmPassword = settings.confirmPassword;
      }

      await axios.put("https://mini-chat-bot-sv7z.onrender.com/api/auth/admin", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(payload);

      alert("Details updated successfully. You will be logged out.");
      logout();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="settings-container">
      <h3>Settings</h3>

      <div className="settings-section">
        <h4>Edit Profile</h4>
        <hr />

        <div className="settings-form">
          <label>First Name</label>
          <input
            type="text"
            value={settings.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />

          <label>Last Name</label>
          <input
            type="text"
            value={settings.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />

          <label>Email</label>
          <div className="input-with-icon">
            <input type="email" value={settings.email} disabled />
            <Icon icon={infoIcon} className="info-icon" />
          </div>

          <label>New Password</label>
          <div className="input-with-icon">
            <input
              type="password"
              value={settings.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Enter new password"
            />
            <Icon icon={infoIcon} className="info-icon" />
          </div>

          <label>Confirm Password</label>
          <div className="input-with-icon">
            <input
              type="password"
              value={settings.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Confirm new password"
            />
            <Icon icon={infoIcon} className="info-icon" />
          </div>
        </div>
      </div>

      <button className="settings-save-btn" onClick={handleUpdate}>
        Save
      </button>
    </div>
  );
}