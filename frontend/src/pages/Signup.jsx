import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <h1 id="welcome">a space for your thoughts.</h1>

      <div className="signup-card">
        <div className="signup-header">
          <button
            type="button"
            className="button"
            id="back-btn"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <h1>Signup</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit" className="button">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;