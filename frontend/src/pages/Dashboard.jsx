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

    {/* Top Header */}
    <div className="dashboard-header">
      <div>
        <h1 className="dashboard-greeting">
          Good Evening, {user.name} 👋
        </h1>
        <p className="dashboard-subtitle">
          Welcome back to Secure Bank. Here's your financial overview.
        </p>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>

    {/* Summary Cards */}
    <div className="summary-grid">

      <div className="summary-card">
        <h3>💳 Current Balance</h3>
        <h2>₹15,000</h2>
        <span>Available Balance</span>
      </div>

      <div className="summary-card">
        <h3>📤 Transfers</h3>
        <h2>12</h2>
        <span>This Month</span>
      </div>

      <div className="summary-card">
        <h3>🎯 Budget</h3>
        <h2>65%</h2>
        <span>Remaining</span>
      </div>

      <div className="summary-card">
        <h3>👥 Groups</h3>
        <h2>3</h2>
        <span>Active Groups</span>
      </div>

    </div>

    {/* Quick Actions */}
    <div className="quick-actions">

      <h2>⚡ Quick Actions</h2>

      <div className="action-buttons">
        <button>Transfer</button>
        <button>Accounts</button>
        <button>Budget</button>
        <button>Groups</button>
      </div>

    </div>

    {/* Recent Transactions */}
    <div className="recent-card">

      <h2>🕒 Recent Transactions</h2>

      <div className="transaction-row">
        <span>Rahul</span>
        <span>₹500</span>
      </div>

      <div className="transaction-row">
        <span>Priya</span>
        <span>₹1200</span>
      </div>

      <div className="transaction-row">
        <span>Aman</span>
        <span>₹850</span>
      </div>

    </div>

  </div>
);
}
 
export default Dashboard;