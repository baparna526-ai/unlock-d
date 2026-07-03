import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">🏦 Secure Bank</h2>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/accounts">Accounts</Link>
        <Link to="/transfer">Transfer</Link>
      </div>
    </nav>
  );
}

export default Navbar;