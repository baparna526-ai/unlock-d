import { useState, useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import "../App.css";

function Transfer() {
  const {
  accounts,
  setAccounts,
  transactions,
  setTransactions,
} = useContext(AccountContext);
  const savingsAccount = accounts.find(
    (account) => account.name === "Savings"
  );

  const balance = savingsAccount.balance;

  const [from] = useState("Savings");
  const [to, setTo] = useState("Rahul");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleTransfer = () => {
    setError("");

    if (amount === "") {
      setError("Please enter amount.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (Number(amount) > balance) {
      setError("Insufficient Balance");
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const updatedAccounts = accounts.map((account) => {
        if (account.name === "Savings") {
          return {
            ...account,
            balance: account.balance - Number(amount),
          };
        }

        return account;
      });

      setAccounts(updatedAccounts);
      const newTransaction = {
  id: Date.now(),
  from,
  to,
  amount: Number(amount),
  remarks,
  status: "Success",
  date: new Date().toLocaleString(),
};

setTransactions([...transactions, newTransaction]);

      alert("Transfer Successful!");

      setAmount("");
      setRemarks("");
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="transfer-container">
      <div className="transfer-card">
        <h1>Transfer Money</h1>

        <h3>Available Balance</h3>
        <p className="balance">₹{balance}</p>

        <label>Transfer From</label>
        <select value={from} disabled>
          <option>Savings</option>
        </select>

        <label>Transfer To</label>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option>Rahul</option>
          <option>Priya</option>
          <option>Aman</option>
        </select>

        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Remarks</label>
        <input
          type="text"
          placeholder="Enter your remarks(optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleTransfer} disabled={processing}>
          {processing ? "Processing..." : "Transfer"}
        </button>
      </div>
    </div>
  );
}

export default Transfer;