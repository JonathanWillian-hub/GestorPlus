import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Metas from './pages/Metas';
import Contas from './pages/Contas';
import Cartoes from './pages/Cartoes';
import Evolucao from './pages/Evolucao';
import AdminUsers from './pages/AdminUsers';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';

export default function App() {
  return (
    <FinanceProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-income" element={<AddIncome />} />
            <Route path="add-expense" element={<AddExpense />} />
            <Route path="history" element={<History />} />
            <Route path="metas" element={<Metas />} />
            <Route path="contas" element={<Contas />} />
            <Route path="cartoes" element={<Cartoes />} />
            <Route path="evolucao" element={<Evolucao />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="termos" element={<Termos />} />
            <Route path="privacidade" element={<Privacidade />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}
