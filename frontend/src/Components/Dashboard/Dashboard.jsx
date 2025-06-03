import { useState } from "react";
import './dashboard.css';
import DetailedCard from "./DetailedCard";

const candidates = [
  {
    name: "Ramesh",
    profession: "Computer Science",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=387&q=80"
  },
  {
    name: "Suresh",
    profession: "Mechanical",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=774&q=80"
  },
  {
    name: "Rajesh",
    profession: "Electrical",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=774&q=80"
  }
];

const headings = ["GS Secretary", "GS Sports", "GS Culturals"];

function Dashboard({ sidebarOpen }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className={`dashboard ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1 className="heading">Welcome to the Dashboard</h1>

      <div className={`three-columns ${sidebarOpen ? '' : 'collapsed-gap'}`}>
        {headings.map((title, colIndex) => (
          <div key={colIndex} className="drop_container">
            <h2 className="column-title">{title}</h2>
            {candidates.map((user, index) => (
              <div key={index} className="drop_card" onClick={() => setSelectedUser(user)}>
                <div className="drop_content">
                  <img src={user.image} className="drop_img" alt={user.name} />
                  <div className="about">
                    <h1 className="name">{user.name}</h1>
                    <span className="profession">{user.profession}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setSelectedUser(null)}>✖</button>
            <DetailedCard user={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
