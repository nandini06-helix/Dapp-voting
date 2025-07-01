import './detailedCard.css';

function DetailedCard({ user, onClose }) {
  return (
    <div className="profile-card-wrapper">
      <button className="close-btn-visible" onClick={onClose}>✖</button>
      <div className="profile-card">
        <div className="avatar-container">
          <img className="avatar" src={user.image} alt={user.name} />
        </div>
        <h1 className="name">{user.name.toUpperCase()}</h1>
        <h2 className="branch">{user.profession}</h2>

        <div className="about-section">
          <h3>ABOUT</h3>
          <p>
            I am passionate about building websites and enjoy working on creative projects.
            I aspire to be a strong developer and love learning new tools and technologies.
          </p>
        </div>

        
      </div>
    </div>
  );
}

export default DetailedCard;
