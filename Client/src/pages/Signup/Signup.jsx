import "./SignupStyle.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import man from "../../assets/logos/man.png";
import Hubly from "../../assets/logos/hubly.png";

export default function Signup() {
  const { signup, error } = useSignup();
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await signup(
        firstname,
        lastname,
        email,
        password,
        confirmPassword
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/admin");
      }
    } catch (err) {
      alert(err?.message || "Signup failed");
    }
  };

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="logo">
          <span className="logo-text">
            <img src={Hubly} alt="" />
          </span>
        </div>

        <div className="form-scroll-wrapper">
          <div className="form-container">
            <div className="form-header">
              <h1>Create an account</h1>
              <a href="/login">Sign in instead</a>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstname">Firstname</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Lastname</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="signup-form-group terms-checkbox">
                <label className="terms-label" >
                  <input
                    type="checkbox"
                    required
                    style={{ marginRight: "8px" }}
                  />
                 <p className="terms-text"> By creating an account, I agree to our{" "}
                  <span>Terms of Use</span><br /> and{" "}
                  <span>Privacy Policy</span></p>
                </label>
              </div>

              <button type="submit" className="signup-submit-btn">
                Create an account
              </button>
            </form>

            {error && <p className="error-msg">{error}</p>}
          </div>
        </div>

        <div className="footer-text">
          This site is protected by reCAPTCHA and Google{" "}
          <span>Privacy Policy</span> and <span>Terms of Service</span> apply.
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <img src={man} alt="Man working on laptop" className="feature-image" />
      </div>
    </div>
  );
}
