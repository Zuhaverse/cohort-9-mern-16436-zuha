import { useNavigate } from "react-router-dom";

import "./Signup.css";

function Signup() {
    const navigate = useNavigate();

  return (
    <div className="signup-page">
      <h1 id="welcome">a space for your thoughts.</h1>
      <div className="signup-card">
      <div className="signup-header">

      <button type="button" className="button" id="back-btn" onClick={() => navigate(-1)}>
      ←
    </button>
      
        <h1>Signup</h1>
        </div>

        <form>

        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="button">
            Signup
          </button>
        </form>

      </div>
    </div>
  );
}

export default Signup;