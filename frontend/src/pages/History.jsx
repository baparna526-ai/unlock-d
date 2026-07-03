import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import "../App.css";

function History() {
  const { transactions } = useContext(AccountContext);

  return (
    <div className="accounts-container">
      <h1>Transaction History</h1>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction.id} className="account-card">
            <h3>{transaction.from} → {transaction.to}</h3>

            <p><strong>Amount:</strong> ₹{transaction.amount}</p>

            <p><strong>Remarks:</strong> {transaction.remarks || "None"}</p>

            <p><strong>Status:</strong> {transaction.status}</p>

            <p><strong>Date:</strong> {transaction.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default History;