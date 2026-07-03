import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../App.css";

function Analytics() {
  const { accounts, transactions } = useContext(AccountContext);

  const savings = accounts.find(
    (account) => account.name === "Savings"
  );

  const totalTransfers = transactions.length;

  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const largestTransfer =
    transactions.length > 0
      ? Math.max(...transactions.map((t) => t.amount))
      : 0;

  const averageTransfer =
    totalTransfers > 0
      ? (totalAmount / totalTransfers).toFixed(2)
      : 0;

  const chartData = transactions.map((transaction, index) => ({
    transfer: `T${index + 1}`,
    amount: transaction.amount,
  }));

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">📊 Analytics Dashboard</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Current Balance</h3>
          <h2>₹{savings.balance}</h2>
        </div>

        <div className="analytics-card">
          <h3>Total Transfers</h3>
          <h2>{totalTransfers}</h2>
        </div>

        <div className="analytics-card">
          <h3>Total Sent</h3>
          <h2>₹{totalAmount}</h2>
        </div>

        <div className="analytics-card">
          <h3>Largest Transfer</h3>
          <h2>₹{largestTransfer}</h2>
        </div>

        <div className="analytics-card">
          <h3>Average Transfer</h3>
          <h2>₹{averageTransfer}</h2>
        </div>
      </div>

      <div className="chart-card">
        <h2>Transfer Amounts</h2>

        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid stroke="#3b3b3b" strokeDasharray="4 4" />

              <XAxis
                dataKey="transfer"
                stroke="#ffffff"
                tick={{ fill: "#ffffff" }}
              />

              <YAxis
                stroke="#ffffff"
                tick={{ fill: "#ffffff" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #8BC34A",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />

              <Bar
                dataKey="amount"
                fill="#8BC34A"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Analytics;