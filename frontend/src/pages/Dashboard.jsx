import { useState, useEffect } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // check login state
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // LOGIN
  const handleLogin = () => {
    setError("");

    if (!name || !dob || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 4) {
      setError("Password too short");
      return;
    }

    const newUser = { name, dob };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setName("");
    setDob("");
    setPassword("");
  };

  // 🔒 LOGIN SCREEN
  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Secure Bank Login</h1>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  // 🔓 DASHBOARD SCREEN
  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>🏦 Secure Bank</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">

        <h1 className="welcome-title">
          Welcome to Secure Bank
        </h1>

        <p className="welcome-subtext">
          Welcome, {user.name} 👋
        </p>

        <p className="info-text">
          Manage your accounts, transfer money, and view history securely.
        </p>

      </div>

    </div>
  );
}

export default Dashboard;