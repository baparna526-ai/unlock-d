import { useState } from "react";
import "../App.css";

function Transfer() {
  const balance = 15000;

  const [from] = useState("Savings Account");
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
      alert("Transfer Successful!");
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="transfer-container">
      <div className="transfer-card">
        <h1>Transfer Money</h1>

        <h3>Available Balance</h3>
        <p className="balance">₹ {balance}</p>

        <label>Transfer From</label>
        <select value={from}>
          <option>Savings Account</option>
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
          placeholder="Birthday Gift"
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