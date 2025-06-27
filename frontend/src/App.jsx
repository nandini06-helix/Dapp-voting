
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import ConnectWallet from './Components/ConnectWallet/ConnectWallet';
import AdminPage from "./Components/Admin/AdminPage"; // or wherever you save it
import Vote from './Components/Vote/Vote';
import Results from './Components/Results/Results'; // Add this import

import './App.css';
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Paths where sidebar should NOT be shown
  const hideSidebarRoutes = ['/login', '/connect-wallet'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <div
        style={{
          // marginLeft: !shouldHideSidebar && isSidebarOpen ? '-450px' : '6px',
          transition: 'margin 0.3s ease',
          padding: '20px',
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard sidebarOpen={sidebarOpen} />}/>
          <Route path="/vote" element={<Vote />} />
          <Route path="/results" element={<Results />} />
          <Route path="/connect-wallet" element={<ConnectWallet />} />
          <Route
  path="/admin"
  element={
    sessionStorage.getItem("role") === "admin" ? (
      <AdminPage />
    ) : (
      <Navigate to="/dashboard" />
    )
  }
/>

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;