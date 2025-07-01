import { useState, createContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Vote from './Components/Vote/Vote';
import './App.css';
import Results from './Components/Results/Results';

// Theme context (toggle disabled)
export const ThemeContext = createContext();

function AppContent() {
  const location = useLocation();
  const [theme] = useState('light'); // fixed theme; toggle removed

  const hideSidebarRoutes = ['/login'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className={`app-wrapper ${theme}`}>
        {!shouldHideSidebar && <Sidebar />}
        <div className="main-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/results" element={<Results/>} />
          </Routes>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
