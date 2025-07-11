 import './detailedCard.css';

function DetailedCard({ user, onClose }) {
  return (
    <div className="profile-card-wrapper">
      <button className="close-btn-visible" onClick={onClose}>✖</button>
      <div className="profile-card">
        <div className="avatar-container">
          <img className="avatar" src={`http://localhost:5000${user.imageUrl}`} alt={user.name} />
        </div>
        <h1 className="name">{user.name.toUpperCase()}</h1>
        <h2 className="branch">{user.position}</h2>

        <div className="about-section">
          <h3>ABOUT</h3>
          <p>{user.agenda}</p>  {/*shows actual agenda from backend */}
        </div>
      </div>
    </div>
  );
}

export default DetailedCard;

