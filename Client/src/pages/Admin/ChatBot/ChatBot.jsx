import React, { useEffect, useState } from "react";
import "./ChatBot.css";
import robot from "../../../assets/logos/robot.png";
import { Icon } from "@iconify/react";
import paperPlaneIcon from "@iconify/icons-fa-solid/paper-plane";
import closeIcon from "@iconify/icons-mdi/close";
import editIcon from "@iconify/icons-mdi/pencil";

export default function ChatBot() {
  const defaultConfig = {
    headerColor: "#33475B",
    backgroundColor: "#EEEEEE",
    messages: ["How can I help you?", "Ask me anything!"],
    missedChatTimer: "00:10:00",
  };

  const [config, setConfig] = useState(defaultConfig);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    try {
      const storedConfig = JSON.parse(localStorage.getItem("chatConfig"));
      if (storedConfig) setConfig({ ...defaultConfig, ...storedConfig });
    } catch (err) {
      console.warn("Failed to load config, using defaults", err);
      setConfig(defaultConfig);
    }
  }, []);

  const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

  const headerColor = isValidHex(config.headerColor)
    ? config.headerColor
    : defaultConfig.headerColor;

  const backgroundColor = isValidHex(config.backgroundColor)
    ? config.backgroundColor
    : defaultConfig.backgroundColor;

  return (
    <div className="bot-widget-container-root">
      <h3>Chat Bot</h3>
      <div className="bot-widget-container" style={{ backgroundColor }}>
        <div className="chat-header" style={{ backgroundColor: headerColor }}>
          <div className="agent-info">
            <div className="agent-avatar">
              <img src={robot} alt="Hubly Agent" />
              <span className="online-indicator"></span>
            </div>
            <span className="agent-name">Hubly</span>
          </div>
        </div>

        <div className="chat-body">
          <div className="message bot">
            <img src={robot} alt="bot" className="bot-avatar" />

            <div className="form-card">
              <h3 className="form-title">Introduction Yourself</h3>

              <form>
                <div className="chat-form-group">
                  <label>Your Name</label>
                  <input type="text" required placeholder="Enter your name" />
                </div>

                <div className="chat-form-group">
                  <label>Your Phone</label>
                  <input type="tel" required placeholder="+91 99999 99999" />
                </div>

                <div className="chat-form-group">
                  <label>Your Email</label>
                  <input type="email" placeholder="example@gmail.com" />
                </div>

                <button className="submit-button">Thank You!</button>
              </form>
            </div>
          </div>
        </div>

        <div className="chat-footer">
          <input
            type="text"
            className="message-input"
            placeholder={"Write a message…"}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Icon icon={paperPlaneIcon} width="20" height="20" color="#B0C1D4" />
        </div>
      </div>

      <div className="bot-initial-msg">
        <Icon icon={closeIcon} className="bot-cross" width="24" />
        <img src={robot} className="bot-robot" alt="robot" />
        <p>
          👋 Want to chat about Hubly? I'm a chatbot here to help you find your
          way.
        </p>
      </div>

      <div className="header-color-picker">
        <label className="label">Header Color</label>
        <div className="color-options">
          {["#FFFFFF", "#000000", "#33475B"].map((c, idx) => (
            <div
              key={idx}
              className="color-circle"
              style={{ backgroundColor: c }}
            ></div>
          ))}
        </div>
        <div className="custom-color">
          <div
            className="color-preview"
            style={{ backgroundColor: headerColor }}
          ></div>
          <input
            type="text"
            className="color-input"
            value={headerColor}
            readOnly
          />
        </div>
      </div>

      {/* BACKGROUND COLOR */}
      <div className="card">
        <span className="title">Custom Background Color</span>
        <div className="color-options">
          <div className="color-circle light"></div>
          <div className="color-circle dark selected"></div>
          <div className="color-circle light"></div>
        </div>
        <div className="hex-input-wrapper">
          <div
            className="hex-preview"
            style={{ backgroundColor: backgroundColor }}
          ></div>
          <input
            type="text"
            className="hex-input"
            value={backgroundColor}
            readOnly
          />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="message-card">
        <span className="message-title">Customize Message</span>
        {(config.messages || defaultConfig.messages).map((msg, idx) => (
          <div key={idx} className="message-box">
            <span>{msg}</span>
            <Icon icon={editIcon} className="edit-icon" />
          </div>
        ))}
      </div>

      {/* INTRO FORM */}
      <div className="Intro-form-card">
        <h3 className="Intro-form-title">Introduction Form</h3>

        <label className="Intro-form-label">Your name</label>
        <input
          className="Intro-form-input"
          type="text"
          placeholder="Your name"
        />

        <label className="Intro-form-label">Your Phone</label>
        <input
          className="Intro-form-input"
          type="text"
          placeholder="+1 (000) 000-0000"
        />

        <label className="Intro-form-label">Your Email</label>
        <input
          className="Intro-form-input"
          type="email"
          placeholder="example@gmail.com"
        />

        <button className="Intro-form-button">Thank You!</button>
      </div>

      {/* WELCOME MESSAGE */}
      <div className="cm-wrapper">
        <h2 className="cm-heading">Welcome Message</h2>
        <div className="cm-card">
          <p className="cm-text">
            👋 Want to chat about Hubly? I'm an chatbot here to help you find
            your way.
          </p>
          <div className="cm-meta">
            <span className="cm-count">15/50</span>
            <Icon icon={editIcon} className="cm-edit-icon" />
          </div>
        </div>
      </div>

      {/* MISSED CHAT TIMER */}
      <div className="mct-wrap">
        <h3 className="mct-title">Missed chat timer</h3>
        <div className="mct-grid">
          <div className="mct-column">
            <span>12</span>
            <span>09</span>
            <span>59</span>
          </div>

          <div className="mct-column">
            <div className="mct-colum-middle">
              <span>00</span>
              <span className="mct-colon">:</span>
              <span>10</span>
              <span className="mct-colon">:</span>
              <span>00</span>
            </div>
          </div>
          {/* <span className="mct-colon">:</span> */}
          <div className="mct-column">
            <span>00</span>
            <span>11</span>
            <span>01</span>
          </div>
        </div>
        <button className="mct-save-btn">Save</button>
      </div>
    </div>
  );
}
