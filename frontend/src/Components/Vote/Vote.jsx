
// import React, { useState, useEffect } from "react";
// import "./vote.css";
// import { BrowserProvider, Contract } from "ethers";
// import { useLocation } from "react-router-dom";
// import VotingABI from "../../abi/Voting.json";

// const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

// export default function Vote() {
//   const [posts, setPosts] = useState([]);
//   const [candidatesMap, setCandidatesMap] = useState({});
//   const [votes, setVotes] = useState({});
//   const [current, setCurrent] = useState(0);
//   const [isReview, setIsReview] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const location = useLocation();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const provider = new BrowserProvider(window.ethereum);
//         const contract = new Contract(contractAddress, VotingABI.abi, provider);

//         const positions = await contract.getPositions();
//         const map = {};

//         for (const pos of positions) {
//           const count = await contract.getCandidateCount(pos);
//           const candidates = [];
//           for (let i = 1; i <= count; i++) {
//             const [name] = await contract.getCandidate(pos, i);
//             candidates.push({ id: i, name });
//           }
//           map[pos] = candidates;
//         }

//         setPosts(positions);
//         setCandidatesMap(map);
//         setLoading(false);

//         const signer = await provider.getSigner();
//         const userAddress = await signer.getAddress();
//         const ownerAddress = await contract.owner();
//         setIsAdmin(userAddress.toLowerCase() === ownerAddress.toLowerCase());
//       } catch (err) {
//         console.error("❌ Failed to fetch voting data:", err);
//         alert("❌ Failed to load candidates from blockchain.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [location.pathname]);

//   const handleVote = (post, candidateId) => {
//     if (isAdmin) return;
//     setVotes(prev => ({ ...prev, [post]: candidateId }));
//   };
// const next = () => {
//   if (current < posts.length - 1) {
//     setCurrent(current + 1);
//   } else {
//      setIsReview(true);
//    }
//  };
//   const prev = () => {
//     if (isReview) {
//       setIsReview(false);
//     } else if (current > 0) {
//       setCurrent(current - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const provider = new BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new Contract(contractAddress, VotingABI.abi, signer);

//       const votingStarted = await contract.votingStarted();
//       const votingEnded = await contract.votingEnded();
//       const start = Number(await contract.votingStartTime());
//       const end = Number(await contract.votingEndTime());
//       const now = Math.floor(Date.now() / 1000);

//       if (!votingStarted || votingEnded || now < start || now > end) {
//         alert("Voting is not active right now.");
//         return;
//       }

//       for (const post of posts) {
//         const candidateId = votes[post];
//         if (candidateId) {
//           const tx = await contract.vote(post, candidateId);
//           await tx.wait();
//         }
//       }

//       alert("✅ Your vote has been recorded on the blockchain.");
//     } catch (err) {
//       console.error("❌ Voting failed:", err);
//       alert("❌ Voting failed. Check console for details.");
//     }
//   };

//   if (loading) return <p>Loading voting interface...</p>;

//   // if (!loading && posts.length === 0) {
//   //   return (
//   //     <div className="vote-wrapper">
//   //       <div className="vote-box">
//   //         <h2>No candidates have been added yet.</h2>
//   //       </div>
//   //     </div>
//   //   );
//   // }
// if (!loading && posts.length === 0) {
//   return (
//     <div className="vote-wrapper">
//       <div className="vote-box">
//         <div className="no-candidates-message">
//           <h1 className="post-title">Voting</h1>
//           <h2 className="subheading">No candidates have been added yet.</h2>
//         </div>
//       </div>
//     </div>
//   );
// }

//   return (
//     <div className="vote-wrapper">
//       <div className="vote-box">
//         <h1 className="post-title">
//           {isReview ? "Review your choices" : posts[current]}
//         </h1>
//         <h2 className="subheading">
//           {isReview ? "You voted for:" : "Select your candidate"}
//         </h2>

//         {!isReview ? (
//           <form className="candidate-list">
//             {candidatesMap[posts[current]]?.map(c => (
//               <label key={c.id} className="radio-option">
//                 <input
//                   type="radio"
//                   name={posts[current]}
//                   value={c.id}
//                   checked={votes[posts[current]] === c.id}
//                   onChange={() => handleVote(posts[current], c.id)}
//                   className="vote-radio"
//                   disabled={isAdmin}
//                 />
//                 <span className="candidate-name">{c.name}</span>
//               </label>
//             ))}
//           </form>
//         ) : (
//           <ul className="review-list">
//             {posts.map(post => {
//               const candId = votes[post];
//               const cand = candidatesMap[post]?.find(c => c.id === candId);
//               return (
//                 <li key={post}>
//                   <strong>{post}:</strong> {cand ? cand.name : "Not selected"}
//                 </li>
//               );
//             })}
//           </ul>
//         )}

//         <div className="form-buttons">
//           <button className="back-btn" onClick={prev} disabled={current === 0 && !isReview}>
//             Back
//           </button>
//           {!isReview ? (
//             <button onClick={next} className="next-btn">
//               Next
//             </button>
//           ) : (
//             !isAdmin && (
//               <button onClick={handleSubmit} className="submit-btn">
//                 Submit Vote
//               </button>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import "./vote.css";
import { BrowserProvider, Contract } from "ethers";
import { useLocation } from "react-router-dom";
import VotingABI from "../../abi/Voting.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function Vote() {
  const [posts, setPosts] = useState([]);
  const [candidatesMap, setCandidatesMap] = useState({});
  const [votes, setVotes] = useState({});
  const [votedStatus, setVotedStatus] = useState({});
  const [hasVotedAny, setHasVotedAny] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isReview, setIsReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, VotingABI.abi, provider);

        const positions = await contract.getPositions();
        const map = {};

        for (const pos of positions) {
          const count = await contract.getCandidateCount(pos);
          const candidates = [];
          for (let i = 1; i <= count; i++) {
            const [name] = await contract.getCandidate(pos, i);
            candidates.push({ id: i, name });
          }
          map[pos] = candidates;
        }

        setPosts(positions);
        setCandidatesMap(map);

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const ownerAddress = await contract.owner();
        setIsAdmin(userAddress.toLowerCase() === ownerAddress.toLowerCase());

        // Check voted status for each position
        const statusMap = {};
        let votedAny = false;
        for (const pos of positions) {
          const voted = await contract.hasVoted(userAddress, pos);
          statusMap[pos] = voted;
          if (voted) votedAny = true;
        }
        setVotedStatus(statusMap);
        setHasVotedAny(votedAny);
      } catch (err) {
        console.error("❌ Failed to fetch voting data:", err);
        alert("❌ Failed to load candidates from blockchain.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  const handleVote = (post, candidateId) => {
    if (isAdmin || hasVotedAny) return;
    setVotes(prev => ({ ...prev, [post]: candidateId }));
  };

  const next = () => {
    if (current < posts.length - 1) {
      setCurrent(current + 1);
    } else {
      setIsReview(true);
    }
  };

  const prev = () => {
    if (isReview) {
      setIsReview(false);
    } else if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = async () => {
    if (hasVotedAny) {
      alert("You have already voted.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, VotingABI.abi, signer);

      const votingStarted = await contract.votingStarted();
      const votingEnded = await contract.votingEnded();
      const start = Number(await contract.votingStartTime());
      const end = Number(await contract.votingEndTime());
      const now = Math.floor(Date.now() / 1000);

      if (!votingStarted || votingEnded || now < start || now > end) {
        alert("Voting is not active right now.");
        return;
      }

      for (const post of posts) {
        const candidateId = votes[post];
        if (candidateId) {
          const tx = await contract.vote(post, candidateId);
          await tx.wait();
        }
      }

      alert("✅ Your vote has been recorded on the blockchain.");
      window.location.reload(); // Refresh to show voting status
    } catch (err) {
      console.error("❌ Voting failed:", err);
      alert("❌ Voting failed. Check console for details.");
    }
  };

  if (loading) return <p>Loading voting interface...</p>;

  if (!loading && posts.length === 0) {
    return (
      <div className="vote-wrapper">
        <div className="vote-box">
          <div className="no-candidates-message">
            <h1 className="post-title">Voting</h1>
            <h2 className="subheading">No candidates have been added yet.</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vote-wrapper">
      <div className="vote-box">
        <h1 className="post-title">
          {isReview ? "Review your choices" : posts[current]}
        </h1>
        <h2 className="subheading">
          {isReview ? "You voted for:" : "Select your candidate"}
        </h2>

        {hasVotedAny && !isReview && (
          <p className="info-msg">✅ You have already voted. Voting is disabled.</p>
        )}

        {!isReview ? (
          <form className="candidate-list">
            {candidatesMap[posts[current]]?.map(c => (
              <label key={c.id} className="radio-option">
                <input
                  type="radio"
                  name={posts[current]}
                  value={c.id}
                  checked={votes[posts[current]] === c.id}
                  onChange={() => handleVote(posts[current], c.id)}
                  className="vote-radio"
                  disabled={isAdmin || hasVotedAny}
                />
                <span className="candidate-name">{c.name}</span>
              </label>
            ))}
          </form>
        ) : (
          <ul className="review-list">
            {posts.map(post => {
              const candId = votes[post];
              const cand = candidatesMap[post]?.find(c => c.id === candId);
              return (
                <li key={post}>
                  <strong>{post}:</strong> {cand ? cand.name : "Not selected"}
                </li>
              );
            })}
          </ul>
        )}

        <div className="form-buttons">
          <button className="back-btn" onClick={prev} disabled={current === 0 && !isReview}>
            Back
          </button>
          {!isReview ? (
            <button onClick={next} className="next-btn">
              Next
            </button>
          ) : (
            !isAdmin && (
              <button
                onClick={handleSubmit}
                className="submit-btn"
                disabled={hasVotedAny}
              >
                {hasVotedAny ? "Vote Submitted" : "Submit Vote"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
