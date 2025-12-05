import React, { useState, useRef, useEffect } from "react";
import api from "../../api/axiosConfig";
import "./MiniChatBox.css";
import robot from "../../assets/logos/robot.png";
import { Icon } from "@iconify/react";
import paperPlaneIcon from "@iconify/icons-fa-solid/paper-plane";
import axios from "axios";

export default function MiniChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [initialMsgSent, setInitialMsgSent] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [firstUserMessage, setFirstUserMessage] = useState(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const chatBodyRef = useRef(null);

  const isAndroid =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!initialMsgSent) {
      setInitialMsgSent(true);
      setFirstUserMessage(input);
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: input },
        { type: "form", sender: "bot-form" },
      ]);
      setInput("");
      return;
    }

    if (!formFilled) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Please fill the form before sending more messages.",
        },
      ]);
      setInput("");
      return;
    }
    // Add user message locally
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      if (ticketId) {
        await api.post(`/tickets/${ticketId}/messages`, { text: input });
      }
    } catch (err) {
      console.error("Failed to send:", err);
    }

    setInput("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      alert("Please fill all fields");
      return;
    }

    const res = await axios.post("https://mini-chat-bot-ax9y.onrender.com/api/tickets/public", {
      name: form.name,
      email: form.email,
      phone: form.phone,
    });

    const newTicketId = res.data.ticketId;
    setTicketId(newTicketId);
    setFormFilled(true);

    setForm({ name: "", phone: "", email: "" });
    setMessages((prev) => prev.filter((msg) => msg.type !== "form"));

    // first user message immediately after form submit
    if (firstUserMessage) {
      await axios.post(`https://mini-chat-bot-ax9y.onrender.com/api/tickets/${newTicketId}/messages`, {
        text: firstUserMessage,
        sender: "user",
      });
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: firstUserMessage },
        { sender: "bot", text: "How can I help you?" },
        { sender: "bot", text: "Ask me anything!" },
        { sender: "bot", text: "Do you wanna ask something?" },
      ]);
      setFirstUserMessage(null);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "How can I help you?" },
        { sender: "bot", text: "Ask me anything!" },
        { sender: "bot", text: "Do you wanna ask something?" },
      ]);
    }

    setInput("");
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleFocus = () => setIsKeyboardOpen(true);
  const handleBlur = () => setIsKeyboardOpen(false);

  return (
    <div className="chat-widget-container">
      <div className="chat-header">
        <div className="agent-info">
          <div className="agent-avatar">
            <img src={robot} alt="Hubly Agent" />
            <span className="online-indicator"></span>
          </div>
          <span className="agent-name">Hubly</span>
        </div>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => {
          if (msg.type === "form") {
            return (
              <div key={index} className="message bot">
                <img src={robot} alt="bot" className="bot-avatar" />
                <div className="form-card">
                  <h3 className="form-title">Introduce Yourself</h3>
                  <form onSubmit={handleFormSubmit}>
                    <div className="chat-form-group">
                      <label>Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="chat-form-group">
                      <label>Your Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 99999 99999"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="chat-form-group">
                      <label>Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>

                    <button className="submit-button">Submit</button>
                  </form>
                </div>
              </div>
            );
          }

          return (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" && (
                <img src={robot} alt="bot" className="bot-avatar" />
              )}
              <div className="message-text">{msg.text}</div>
            </div>
          );
        })}

        {!initialMsgSent && (
          <div className="start-message">Start a conversation</div>
        )}
      </div>

      <div
        className={`chat-footer ${isKeyboardOpen ? "keyboard-open" : ""} ${
          isAndroid ? "android" : ""
        }`}
      >
        <textarea
          type="text"
          className="message-input"
          placeholder="Write a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus} 
          onBlur={handleBlur}
        />
        <div className="send-icon-wrapper">
          <Icon
            onClick={sendMessage}
            icon={paperPlaneIcon}
            width="22"
            height="22"
            color="#B0C1D4"
          />
        </div>
      </div>
    </div>
  );
}