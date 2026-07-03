import { useState, useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import "../App.css";

function Groups() {
  const { groups, setGroups } = useContext(AccountContext);

  const [groupName, setGroupName] = useState("");
  const [member, setMember] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const createGroup = () => {
    if (!groupName) return;

    const newGroup = {
      id: Date.now(),
      name: groupName,
      members: [],
      expenses: [],
    };

    setGroups([...groups, newGroup]);
    setGroupName("");
  };

  const addMember = (groupId) => {
    if (!member) return;

    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: [...group.members, member],
            }
          : group
      )
    );

    setMember("");
  };

  const addExpense = (groupId) => {
    if (!expenseName || !expenseAmount || !paidBy) return;

    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              expenses: [
                ...group.expenses,
                {
                  title: expenseName,
                  amount: Number(expenseAmount),
                  paidBy,
                },
              ],
            }
          : group
      )
    );

    setExpenseName("");
    setExpenseAmount("");
    setPaidBy("");
  };

  return (
    <div className="groups-container">
      <h1>👥 Group Expense Manager</h1>

      <div className="group-card">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <button onClick={createGroup}>Create Group</button>
      </div>

      {groups.map((group) => {
        const totalExpense = group.expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        return (
          <div className="group-card" key={group.id}>
            <h2>{group.name}</h2>

            <h3>Members</h3>

            <ul>
              {group.members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>

            <input
              type="text"
              placeholder="Add Member"
              value={member}
              onChange={(e) => setMember(e.target.value)}
            />

            <button onClick={() => addMember(group.id)}>
              Add Member
            </button>

            <hr />

            <h3>Add Expense</h3>

            <input
              type="text"
              placeholder="Expense Name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />

            <input
              type="text"
              placeholder="Paid By"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            />

            <button onClick={() => addExpense(group.id)}>
              Add Expense
            </button>

            <h3>Expenses</h3>

            {group.expenses.map((expense, index) => (
              <div key={index} className="expense-card">
                <p>
                  <strong>{expense.title}</strong>
                </p>

                <p>₹{expense.amount}</p>

                <p>Paid by: {expense.paidBy}</p>
              </div>
            ))}

            <h2>Total Expense</h2>

            <h1>₹{totalExpense}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default Groups;