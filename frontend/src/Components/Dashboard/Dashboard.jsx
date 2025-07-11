 import { useState, useEffect } from "react";
import './dashboard.css';
import DetailedCard from "./DetailedCard";
import axios from 'axios';

const headings = ["President", "Vice President", "Secretary", "Treasurer"];

function Dashboard({ sidebarOpen }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const currentElectionId = localStorage.getItem("electionId");

  useEffect(() => {
    if (!currentElectionId) {
      console.warn("⚠️ No electionId found in localStorage.");
      return;
    }

    console.log("📦 Fetching candidates for electionId:", currentElectionId);

    axios.get(`http://localhost:5000/api/candidates?electionId=${currentElectionId}`)
      .then((res) => {
        console.log("✅ Fetched candidates:", res.data);
        setCandidates(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching candidates:", err);
      });
  }, [currentElectionId]);

  const groupedCandidates = headings.reduce((acc, heading) => {
    acc[heading] = candidates.filter(c =>
      c.position.toLowerCase().replace(/\s/g, '') === heading.toLowerCase().replace(/\s/g, '')
    );
    return acc;
  }, {});

  return (
    <div className={`dashboard ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1 className="heading">Candidates List</h1>

      <div className={`three-columns ${sidebarOpen ? '' : 'collapsed-gap'}`}>
        {headings.map((title, colIndex) => (
          <div key={colIndex} className="drop_container">
            <h2 className="column-title">{title}</h2>
            {groupedCandidates[title]?.length > 0 ? (
              groupedCandidates[title].map((user, index) => (
                <div key={index} className="drop_card" onClick={() => setSelectedUser(user)}>
                  <div className="drop_content">
                    <img
                      src={`http://localhost:5000${user.imageUrl}`}
                      className="drop_img"
                      alt={user.name}
                    />
                    <div className="about">
                      <h1 className="name">{user.name}</h1>
                      <span className="profession">{user.position}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-candidate">No candidates for this position.</p>
            )}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <DetailedCard user={selectedUser} onClose={() => setSelectedUser(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;






