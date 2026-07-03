import { useState } from "react";
import "../App.css";

function Accounts() {
  const accounts = [
    {
      id: 1,
      name: "Savings",
      balance: 15000,
      icon: "🏦",
    },
    {
      id: 2,
      name: "Checking",
      balance: 8500,
      icon: "💳",
    },
    {
      id: 3,
      name: "Business",
      balance: 45000,
      icon: "🏢",
    },
  ];

  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  return (
    <div className="accounts-container">
      <h1>My Accounts</h1>

      {accounts.map((account) => (
        <div
          key={account.id}
          className="account-card"
          onClick={() => setSelectedAccount(account)}
        >
          <h2>
            {account.icon} {account.name}
          </h2>

          <p>Balance: ₹{account.balance}</p>
        </div>
      ))}

      <div className="selected-account">
        <h2>Selected Account</h2>

        <h3>{selectedAccount.name}</h3>

        <h1>₹{selectedAccount.balance}</h1>
      </div>
    </div>
  );
}

export default Accounts;