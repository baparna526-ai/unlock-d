import { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import "../App.css";

function Budget() {
  const { transactions } = useContext(AccountContext);

  const [budget, setBudget] = useState(20000);

  const totalSpent = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const remaining = budget - totalSpent;

  const percentage =
    budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  return (
    <div className="accounts-container">
      <h1>Monthly Budget</h1>

      <div className="account-card">
        <label>Set Monthly Budget</label>

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />

        <h2>Budget: ₹{budget}</h2>

        <h2>Spent: ₹{totalSpent}</h2>

        <h2>Remaining: ₹{remaining}</h2>

        <progress
          value={percentage}
          max="100"
          style={{ width: "100%", height: "20px" }}
        ></progress>

        <p>{percentage.toFixed(1)}% Used</p>
      </div>
    </div>
  );
}

export default Budget;