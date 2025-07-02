
import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import VotingABI from "../../abi/Voting.json";
import "./Result.css";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingEnded, setVotingEnded] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, VotingABI.abi, provider);

        const ended = await contract.votingEnded();
        setVotingEnded(ended);

        if (!ended) return;

        const positions = await contract.getPositions();
        const resultsData = [];

        for (let pos of positions) {
          const [winners, voteCount] = await contract.getWinnersByPosition(pos);

          // For demo, use placeholder image (replace with image from contract if available)
          resultsData.push({
            position: pos,
            winners,
            voteCount: voteCount.toString(),
            image: "https://source.unsplash.com/160x160/?person&sig=" + Math.floor(Math.random() * 1000)
          });
        }

        setResults(resultsData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading results:", err);
        alert("Error fetching results. Check console.");
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="results-wrapper">
      <h1 className="results-heading">Results of Elections</h1>

      {!votingEnded ? (
        <p className="status-message">⏳ Voting is still ongoing. Please check back later.</p>
      ) : loading ? (
        <p className="status-message">Loading results...</p>
      ) : (
        <div className="card-container">
          {results.map((r, idx) => (
            <div className="flip-card" key={idx}>
              <div className="flip-card-inner">
                {/* Front */}
                <div className="flip-card-front">
                  <h2>{r.position}</h2>
                  <p>Hover to see winner</p>
                </div>

                {/* Back */}
                <div className="flip-card-back">
                  {r.winners.map((name, i) => (
                    <div key={i} style={{ marginBottom: "15px" }}>
                      <h2>{name}</h2>
                      <h3>{r.position}</h3>
                      <p>🗳️ Total Votes: {r.voteCount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}