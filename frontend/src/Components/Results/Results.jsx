import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
import { BrowserProvider, Contract } from "ethers";

import VotingABI from "../../abi/Voting.json";


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
          resultsData.push({ position: pos, winners, voteCount: voteCount.toString() });
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Election Results</h2>
      {!votingEnded ? (
        <p className="text-gray-500">⏳ Voting is still ongoing. Please check back later.</p>
      ) : loading ? (
        <p className="text-blue-500">Loading results...</p>
      ) : (
        <div className="space-y-4">
          {results.map((r, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold">📌 {r.position}</h3>
              <p className="text-sm">🗳️ Total Votes: {r.voteCount}</p>
              <ul className="list-disc list-inside mt-2">
                {r.winners.map((name, i) => (
                  <li key={i}>🏆 {name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
