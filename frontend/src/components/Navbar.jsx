import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdOutlineAnalytics,
} from "react-icons/md";
import {
  FaExchangeAlt,
  FaHistory,
  FaUsers,
} from "react-icons/fa";
import { BsPiggyBankFill } from "react-icons/bs";

function Navbar() {
  const location = useLocation();

  return (
    <aside className="sidebar">

      <div className="logo-section">
        <h2>🏦</h2>
        <h3>Secure Bank</h3>
      </div>

      <nav>

        <Link
          className={location.pathname === "/" ? "active-link" : ""}
          to="/"
        >
          <MdDashboard />
          Dashboard
        </Link>

        <Link
          className={location.pathname === "/accounts" ? "active-link" : ""}
          to="/accounts"
        >
          <MdAccountBalanceWallet />
          Accounts
        </Link>

        <Link
          className={location.pathname === "/transfer" ? "active-link" : ""}
          to="/transfer"
        >
          <FaExchangeAlt />
          Transfer
        </Link>

        <Link
          className={location.pathname === "/history" ? "active-link" : ""}
          to="/history"
        >
          <FaHistory />
          History
        </Link>

        <Link
          className={location.pathname === "/budget" ? "active-link" : ""}
          to="/budget"
        >
          <BsPiggyBankFill />
          Budget
        </Link>

        <Link
          className={location.pathname === "/analytics" ? "active-link" : ""}
          to="/analytics"
        >
          <MdOutlineAnalytics />
          Analytics
        </Link>

        <Link
          className={location.pathname === "/groups" ? "active-link" : ""}
          to="/groups"
        >
          <FaUsers />
          Groups
        </Link>

      </nav>
    </aside>
  );
}

export default Navbar;