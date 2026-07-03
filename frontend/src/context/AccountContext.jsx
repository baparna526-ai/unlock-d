import { createContext, useState } from "react";

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([
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
  ]);

  const [transactions, setTransactions] = useState([]);
  const [groups, setGroups] = useState([]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        setAccounts,
        transactions,
        groups,
        setGroups,
        setTransactions,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};