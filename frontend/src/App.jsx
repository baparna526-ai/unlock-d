import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transfer from "./pages/Transfer";
import History from "./pages/History";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";
import Groups from "./pages/Groups";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/history" element={<History />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/groups" element={<Groups />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;