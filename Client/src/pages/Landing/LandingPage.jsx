import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWidget from "../../components/ChatWidget/MiniChatBox";
import "./landing.css";
import { Icon } from "@iconify/react";
import playCircleIcon from "@iconify/icons-mdi/play-circle-outline";
import closeIcon from "@iconify/icons-mdi/close";

import hublyLogo from "../../assets/logos/hubly.png";
import rectangle from "../../assets/logos/rectangle.png"
import msgcard from "../../assets/logos/msgcard.png";
import analytics from "../../assets/logos/analytics.png";
import calendar from "../../assets/logos/calendar.png";
import company from "../../assets/logos/Company.png";
import elastic from "../../assets/logos/elastic.png";
import operdoor from "../../assets/logos/opendoor.png";
import airtable from "../../assets/logos/airtable.png";
import framer from "../../assets/logos/framer.png";
import robot from "../../assets/logos/robot.png";

import chaticon from "../../assets/logos/chat-icon.png";
import Cross from "../../assets/logos/Cross.png";

import logos from "../../assets/logos/logos.png";
import funnel from "../../assets/logos/funnel.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const [chatVisible, setChatVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="landing-root">
      <nav className="landing-navbar">
        <img src={hublyLogo} alt="Hubly Logo" className="nav-logo" />
        <div className="landing-buttons">
          <button className="nav-btn login" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="nav-btn signup"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="landing-main">
        <div className="left-part">
          <h1>
            Grow Your Business Faster <br /> with Hubly CRM
          </h1>
          <p>
            Manage leads, automate workflows, and close deals effortlessly — all
            in one powerful platform.
          </p>
          <div className="main-btn-group">
            <button className="primary-btn">Get Started ➜</button>
            <button className="secondary-btn watch-btn">
              <Icon icon={playCircleIcon} className="play-icon" />
              Watch Video
            </button>
          </div>
        </div>
        <div className="right-part">
          <img src={rectangle} className="img-main" alt="Main" />
          <img src={msgcard} className="img-small msgcard" alt="msg" />
          <img
            src={analytics}
            className="img-small analytics"
            alt="analytics"
          />
          <img src={calendar} className="img-small calendar" alt="calendar" />
        </div>
      </div>

      {chatVisible && (
        <div className="initial-msg">
          <Icon
            icon={closeIcon}
            className="cross"
            width="24"
            onClick={() => setChatVisible(false)}
          />
          <img src={robot} className="robot" alt="robot" />
          <p>
            👋 Want to chat about Hubly? I'm a chatbot here to help you find
            your way.
          </p>
        </div>
      )}

      {/* Company Logos */}
      <div className="logos">
        <img src={company} alt="" />
        <img src={elastic} alt="" />
        <img src={operdoor} alt="" />
        <img src={airtable} alt="" />
        <img src={elastic} alt="" />
        <img src={framer} alt="" />
      </div>

      {/* Chat Icon or Close Icon */}
      <div className="chat-container">
        {chatOpen ? (
          <img
            src={Cross}
            alt="close-chat"
            className="chat-toggle-icon"
            onClick={() => setChatOpen(false)}
          />
        ) : (
          <img
            src={chaticon}
            alt="chat-icon"
            className="chat-toggle-icon"
            onClick={() => setChatOpen(true)}
          />
        )}

        {chatOpen && (
          <div className="chat-widget-container-copy">
            <ChatWidget />
          </div>
        )}
      </div>

      {/* // middle page */}
      <div className="crm-wrapper">
        <h1 className="crm-title">
          At its core, Hubly is a robust CRM solution.
        </h1>

        <p className="crm-subtitle">
          Hubly helps businesses streamline customer interactions, track leads,
          and automate tasks— saving you time and maximizing revenue. Whether
          you're a startup or an enterprise, Hubly adapts to your needs, giving
          you the tools to scale efficiently.
        </p>

        <div className="crm-card">
          <div className="crm-left">
            <h3 className="crm-heading">MULTIPLE PLATFORMS TOGETHER!</h3>
            <p className="crm-text">
              Email communication is a breeze with our fully integrated, drag &
              drop email builder.
            </p>

            <h3 className="crm-heading">CLOSE</h3>
            <p className="crm-text">
              Capture leads using our landing pages, surveys, forms, calendars,
              inbound phone system & more!
            </p>

            <h3 className="crm-heading">NURTURE</h3>
            <p className="crm-text">
              Capture leads using our landing pages, surveys, forms, calendars,
              inbound phone system & more!
            </p>
          </div>

          <div className="crm-right">
              <img src={logos} alt="logos" className="crm-right-logos"/>
              <img src={funnel} alt="funnel" className="crm-right-funnel"/>
          </div>
        </div>
      </div>

      {/* // PRICING PART */}
      <div className="pricing-container-flash">
        <header className="pricing-header-flash">
          <h2 className="pricing-title-flash">We have plans for everyone!</h2>
          <p className="pricing-subtitle-flash">
            We started with a strong foundation, then simply built all of the
            sales and <br />
            marketing tools ALL businesses need under one platform.
          </p>
        </header>

        <div className="plans-grid-flash">
          <div className="plan-card-flash starter-plan-flash">
            <h3 className="plan-name-flash">STARTER</h3>
            <p className="plan-description-flash">
              Best for local businesses needing to improve their online
              reputation.
            </p>
            <div className="plan-price-flash">
              <span className="price-amount-flash">$199</span>
              <span className="price-period-flash">/monthly</span>
            </div>

            <h4 className="features-title-flash">What's included</h4>
            <ul className="features-list-flash">
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> Unlimited Users
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> GMB Messaging
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> Reputation
                Management
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> GMB Call Tracking
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> 24/7 Award
                Winning Support
              </li>
            </ul>

            <button className="sign-up-button-flash">
              SIGN UP FOR STARTER
            </button>
          </div>

          {/* Grow Plan */}
          <div className="plan-card-flash grow-plan-flash">
            <h3 className="plan-name-flash">GROW</h3>
            <p className="plan-description-flash">
              Best for all businesses that want to take full control of their
              marketing automation and track their leads, click to close.
            </p>
            <div className="plan-price-flash">
              <span className="price-amount-flash">$399</span>
              <span className="price-period-flash">/monthly</span>
            </div>

            <h4 className="features-title-flash">What's included</h4>
            <ul className="features-list-flash">
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> Pipeline
                Management
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> Marketing
                Automation Campaigns
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> Live Call
                Transfer
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> GMB Messaging
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> Embed-able Form
                Builder
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> Reputation
                Management
              </li>
              <li className="feature-item-flash">
                <span className="feature-check-flash">✓</span> 24/7 Award
                Winning Support
              </li>
            </ul>

            <button className="sign-up-button-flash">
              SIGN UP FOR STARTER
            </button>
          </div>
        </div>
      </div>

      {/* // Footer Section */}
      <footer className="hubly-footer-main-two-row">
        <div className="hubly-footer-content-wrapper-two-row">
          <div className="hubly-footer-logo-section-two-row">
            <div className="hubly-logo-container-two-row">
              <img src={hublyLogo} alt="" />
            </div>
          </div>
          <div className="hubly-footer-links-container-two-row">
            <div className="hubly-footer-links-row-two-row top-row-two-row">
              <div className="hubly-footer-link-column-two-row product-column-two-row">
                <h4 className="hubly-footer-column-title-two-row">Product</h4>
                <ul className="hubly-footer-link-list-two-row">
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Universal checkout
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Payment workflows
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Observability
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      UpliftAI
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Apps & integrations
                    </a>
                  </li>
                </ul>
              </div>

              <div className="hubly-footer-link-column-two-row primer-column-two-row">
                <h4 className="hubly-footer-column-title-two-row">
                  Why Primer
                </h4>
                <ul className="hubly-footer-link-list-two-row">
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Expand to new markets
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Boost payment success
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Improve conversion rates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Reduce payments fraud
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Recover revenue
                    </a>
                  </li>
                </ul>
              </div>

              <div className="hubly-footer-link-column-two-row dev-column-two-row">
                <h4 className="hubly-footer-column-title-two-row">
                  Developers
                </h4>
                <ul className="hubly-footer-link-list-two-row">
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Primer Docs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Payment methods guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Service status
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="hubly-footer-links-row-two-row bottom-row-two-row">
              <div className="hubly-footer-link-column-two-row resources-column-two-row">
                <h4 className="hubly-footer-column-title-two-row">Resources</h4>
                <ul className="hubly-footer-link-list-two-row">
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Success stories
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      News room
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="hubly-footer-link-column-two-row company-column-two-row">
                <h4 className="hubly-footer-column-title-two-row">Company</h4>
                <ul className="hubly-footer-link-list-two-row">
                  <li>
                    <a href="#" className="hubly-footer-link-item-two-row">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="hubly-footer-socials-bar-two-row">
                <div className="hubly-social-icons-container-two-row">
                  <Icon icon="mdi:email-outline" fontSize={25}/>
                  <Icon icon="mdi:linkedin"  fontSize={25}/>
                  <Icon icon="mdi:twitter" fontSize={25}/>
                  <Icon icon="mdi:youtube" fontSize={25}/>
                  <Icon icon="mdi:gamepad-variant-outline" fontSize={25}/>
                  <Icon icon="mdi:instagram" fontSize={25}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
