import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaVoteYea, FaChartBar } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      <nav className="nav-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          <FaHome />
          {isOpen && <span>Dashboard</span>}
        </Link>
        <Link to="/vote" className={location.pathname === '/vote' ? 'active' : ''}>
          <FaVoteYea />
          {isOpen && <span>Vote</span>}
        </Link>
        <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>
          <FaChartBar />
          {isOpen && <span>Results</span>}
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
