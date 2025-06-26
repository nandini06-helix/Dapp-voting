
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaVoteYea,
  FaChartBar,
  FaUserShield,
  FaSignOutAlt
} from 'react-icons/fa';
import './Sidebar.css';
function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role'); // Get user role
  const wallet = sessionStorage.getItem('walletAddress');

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className="nav-links">
        <Link
          to="/dashboard"
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          <FaHome />
          {isOpen && <span>Dashboard</span>}
        </Link>

        <Link
          to="/vote"
          className={location.pathname === '/vote' ? 'active' : ''}
        >
          <FaVoteYea />
          {isOpen && <span>Vote</span>}
        </Link>

        <Link
          to="/results"
          className={location.pathname === '/results' ? 'active' : ''}
        >
          <FaChartBar />
          {isOpen && <span>Results</span>}
        </Link>

        {/* ✅ Admin-only link */}
        {role === 'admin' && (
          <Link
            to="/admin"
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            <FaUserShield />
            {isOpen && <span>Admin Panel</span>}
          </Link>
        )}
      </nav>

      {/* ✅ Logout button */}
      {wallet && (
        <div className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </div>
      )}
    </div>
  );
}

export default Sidebar;