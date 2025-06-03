import './detailedCard.css';

function DetailedCard({ user }) {
  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img className="avatar" src={user.image} alt={user.name} />
      </div>
      <h1 className="name">{user.name.toUpperCase()}</h1>
      <h2 className="university">Netaji Subhas University</h2>

      <div className="about-section">
        <h3>ABOUT</h3>
        <p>
          I am passionate about building websites and enjoy working on creative projects.
          I aspire to be a strong developer and love learning new tools and technologies.
        </p>
      </div>

      <div className="social-icons">
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-linkedin-in"></i>
      </div>
    </div>
  );
}

export default DetailedCard;
