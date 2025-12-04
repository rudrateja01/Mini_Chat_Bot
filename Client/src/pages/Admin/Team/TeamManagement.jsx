import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeamManagement.css";
import { Icon } from "@iconify/react";

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [addPopup, setAddPopup] = useState(false);
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password:"",
    confirmpassword:"",
    role: "user",
  });

  const token = localStorage.getItem("token");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://mini-chat-bot-sv7z.onrender.com/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data || []);

      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleAddUser = async () => {
    try {
      const res = await axios.post("https://mini-chat-bot-sv7z.onrender.com/api/auth/signup", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers([ ...users,res.data.user]); // Add to UI
      setAddPopup(false);

      setNewUser({
        firstname: "",
        lastname: "",
        email: "",
        password:"",
        confirmpassword:"",
        role: "user",
      });
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(
        `https://mini-chat-bot-sv7z.onrender.com/api/auth/users/${selectedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter((u) => u._id !== selectedUser._id));
      setDeletePopup(false);
      setSelectedUser(null);

    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  const admin = users.find((u) => u.role === "admin");
  const regularUsers = users.filter((u) => u.role === "user");

  // Get initials
  const getInitials = (u) => {
    const first = u.firstname?.charAt(0) || "";
    const last = u.lastname?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="team-page">
      <h2 className="team-title">Users</h2>

      <div className="team-table">
        <div className="table-row header">
          <div className="row-left">
            <span className="col-avatar"></span>
            <span className="col-name">Name</span>
            <span className="col-phone">Phone</span>
            <span className="col-email">Email</span>
            <span className="col-role">Role</span>
          </div>
          <div className="row-right"></div>
        </div>

        {/* ADMIN ROW */}
        {admin && (
          <div className="table-row" key={admin._id}>
            <div className="row-left">
              <div className="avatar-initials admin-avatar">{getInitials(admin)}</div>
              <span className="col-name">{admin.firstname} {admin.lastname}</span>
              <span className="col-phone">---</span>
              <span className="col-email">{admin.email}</span>
              <span className="col-role">{admin.role}</span>
            </div>
            <div className="row-right no-actions"></div>
          </div>
        )}

        {/* REGULAR USER */}
        {regularUsers.map((u) => (
          <div className="table-row" key={u._id}>
            <div className="row-left">
              <div className="avatar-initials member-avatar">{getInitials(u)}</div>
              <span className="col-name">{u.firstname} {u.lastname}</span>
              <span className="col-phone">---</span>
              <span className="col-email">{u.email}</span>
              <span className="col-role">{u.role}</span>
            </div>
            <div className="row-right action-buttons">
              <Icon icon="mdi:pencil" className="edit-btn" />
              <Icon
                icon="mdi:delete"
                className="delete-btn"
                onClick={() => {
                  setSelectedUser(u);
                  setDeletePopup(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="add-member-btn" onClick={() => setAddPopup(true)}>
        <Icon icon="mdi:plus-circle" className="plus-icon" />
        Add Team Members
      </button>

      {/* ADD USER POPUP */}
      {addPopup && (
        <div className="add-popup">
          <h2>Add User</h2>
          <p className="popup-desc">
            Talk with colleagues in a group chat. Messages in this group are
            only visible to its participants. New users may only be invited
            by administrators.
          </p>

          <label>First Name</label>
          <input
            type="text"
            value={newUser.firstname}
            onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
            placeholder="Enter first name"
          />

          <label>Last Name</label>
          <input
            type="text"
            value={newUser.lastname}
            onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
            placeholder="Enter last name"
          />

          <label>Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Enter email"
          />

          <label>Password</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Enter password"
          />

          <label>confirmpassword</label>
          <input
            type="password"
            value={newUser.confirmpassword}
            onChange={(e) => setNewUser({ ...newUser, confirmpassword: e.target.value })}
            placeholder="Enter confirmpassword"
          />

          <label>Role</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="popup-buttons bottom-right">
            <button className="cancel" onClick={() => setAddPopup(false)}>Cancel</button>
            <button className="confirm" onClick={handleAddUser}>Save</button>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {deletePopup && selectedUser && (
        <div className="delete-popup">
          <p>
            This user <b>{selectedUser.firstname} {selectedUser.lastname}</b> will be deleted.
          </p>
          <div className="popup-buttons">
            <button className="cancel" onClick={() => setDeletePopup(false)}>Cancel</button>
            <button className="confirm" onClick={handleDelete}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}
