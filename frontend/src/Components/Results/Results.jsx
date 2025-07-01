import React from 'react';
import './results.css';

const results = [
  {
    post: "GS Secretary",
    name: "Ramesh Kumar",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=387&q=80",
    votes: 234,
    margin: 42
  },
  {
    post: "GS Sports",
    name: "Suresh Babu",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=774&q=80",
    votes: 198,
    margin: 30
  },
  {
    post: "GS Cultural",
    name: "Rajeshwari Devi",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=774&q=80",
    votes: 212,
    margin: 38
  }
];

export default function Results() {
  return (
    <div className="results-wrapper">
      <h1 className="results-heading">Results of Elections</h1>

      <div className="card-container">
        {results.map((candidate, idx) => (
          <div className="flip-card" key={idx}>
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front">
                <h2>{candidate.post}</h2>
                <p>Hover to flip</p>
              </div>

              {/* Back */}
              <div className="flip-card-back">
                <h2>{candidate.name}</h2>
                <h3>{candidate.post}</h3>
                <p>🗳️ Won by {candidate.margin} votes</p>
                <p>Total Votes: {candidate.votes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
