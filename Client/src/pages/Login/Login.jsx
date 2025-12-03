import "./LoginStyle.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import man from "../../assets/logos/man.png";
import Hubly from "../../assets/logos/hubly.png";

export default function Login() {
  const { login, error } = useLogin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  const user = await login(email, password);
  console.log("Logged in user:", user);

  if (!user) return; 

  if (user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/user");
  }
};


  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo">
          <span className="logo-text"><img src={Hubly} alt="" /></span>
        </div>

        <div className="form-scroll-wrapper">
          <div className="login-form-container">
            <div className="login-form-header">
              <h1>Sign in to your plexity</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                  <label htmlFor="email">Username</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="login-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="login-submit-btn">
                  Log in
                </button>
            </form>
            {error && <p className="login-error-msg">{error}</p>}
          </div>
          <p className="login-signup-text">
            Don't have an account?{" "}
            <span onClick={()=>navigate("/signup")}>signup</span>
          </p>
        </div>

        <div className="footer-text">
          This site is protected by reCAPTCHA and the Google{" "}
          <span>Privacy Policy</span> and <span>Terms of Service</span>{" "}
          apply.
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <img src={man} alt="Man working on laptop" className="feature-image" />
      </div>
    </div>
  );
}
