import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { Clientes } from './pages/Clientes';
import { Roles } from './pages/Roles';
import { MatrizAcceso } from './pages/MatrizAcceso';
import { YamlView } from './pages/YamlView';
import { VpnUsers } from './pages/VpnUsers';
import { DnsView } from './pages/Dns';

import './App.css';
import './components/ui/ui.css';

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/matriz" element={<MatrizAcceso />} />
            <Route path="/yaml" element={<YamlView />} />
            <Route path="/usuarios" element={<VpnUsers />} />
            <Route path="/dns" element={<DnsView />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

function LoginGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginGuard />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
