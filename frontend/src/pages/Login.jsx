import { Link } from "react-router-dom";

import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <h1 id="welcome">Welcome to NoteSpace!</h1>
      <div className="login-card">
      
        <h1>Login</h1>

        <form>
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
            Login
          </button>
        </form>

        <p>
           Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;