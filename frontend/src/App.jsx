import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Vote from './Components/Vote/Vote';
import './App.css';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Paths where sidebar should NOT be shown
  const hideSidebarRoutes = ['/login'];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <div
        style={{
          marginLeft: !shouldHideSidebar && isSidebarOpen ? '-450px' : '6px',
          transition: 'margin 0.3s ease',
          padding: '20px',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard sidebarOpen={sidebarOpen} />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard sidebarOpen={sidebarOpen} />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/results" element={<div>Results Page</div>} />
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
