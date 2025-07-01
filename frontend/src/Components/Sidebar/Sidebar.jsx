import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaVoteYea,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaVoteYea as FaLogo
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // For redirection

  const handleLogout = () => {
    // Optional: clear session/token
    // localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="project-title">
        <FaLogo className="logo-icon" />
        <span>VoteSys</span>
      </div>

      <nav className="nav-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          <FaHome />
          <span>Dashboard</span>
        </Link>
        <Link to="/vote" className={location.pathname === '/vote' ? 'active' : ''}>
          <FaVoteYea />
          <span>Vote</span>
        </Link>
        <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>
          <FaChartBar />
          <span>Results</span>
        </Link>
      </nav>

      <div className="bottom-actions">
        <button className="bottom-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
