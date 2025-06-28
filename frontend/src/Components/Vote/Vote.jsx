// import React, { useState, useEffect } from "react";
// import "./vote.css";
// import { BrowserProvider, Contract } from "ethers";
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
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const provider = new BrowserProvider(window.ethereum);
//       const contract = new Contract(contractAddress, VotingABI.abi, provider);

//       // 🔹 Fetch dynamic positions
//       const positions = await contract.getPositions();
//       const map = {};

//       for (const pos of positions) {
//         const count = await contract.getCandidateCount(pos);
//         const candidates = [];
//         for (let i = 1; i <= count; i++) {
//           const [name] = await contract.getCandidate(pos, i);
//           candidates.push({ id: i, name, symbol: "⭐" });
//         }
//         map[pos] = candidates;
//       }

//       setPosts(positions);
//       setCandidatesMap(map);
//       setLoading(false);

//       // 🔹 Check if user is admin (owner of contract)
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();
//       const ownerAddress = await contract.owner(); // Your contract should expose getOwner()

//       if (userAddress.toLowerCase() === ownerAddress.toLowerCase()) {
//         setIsAdmin(true);
//       }

//     } catch (err) {
//       console.error("Failed to fetch voting data:", err);
//       alert("❌ Failed to load candidates from blockchain.");
//     }
//   };

//   fetchData();
// }, []);

//  const handleVote = (post, candidateId) => {
//   if (isAdmin) return; 
//   setVotes(prev => ({ ...prev, [post]: candidateId }));
// };

//  const next = () => {
//   if (current < posts.length - 1) {
//     setCurrent(current + 1);
//   } else {
//     setIsReview(true);
//   }
// };


//   const prev = () => {
//     if (isReview) {
//       setIsReview(false);
//     } else if (current > 0) {
//       setCurrent(current - 1);
//     }
//   };
// const handleSubmit = async () => {
//   try {
//     const provider = new BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const contract = new Contract(contractAddress, VotingABI.abi, signer);

//     // 🧪 DEBUG: Check on-chain voting status
//     const votingStarted = await contract.votingStarted();
//     const votingEnded = await contract.votingEnded();
//     const start = Number(await contract.votingStartTime());
//     const end = Number(await contract.votingEndTime());
//     const now = Math.floor(Date.now() / 1000);

//     console.log("🧪 Voting Status Debug:");
//     console.log("votingStarted:", votingStarted);
//     console.log("votingEnded:", votingEnded);
//     console.log("start:", start, new Date(start * 1000).toLocaleString());
//     console.log("end:", end, new Date(end * 1000).toLocaleString());
//     console.log("now:", now, new Date(now * 1000).toLocaleString());

//     // Add this condition to prevent failed transaction
//     if (!votingStarted || votingEnded || now < start || now > end) {
//       alert("Voting is not active right now.");
//       return;
//     }

//     for (const post of posts) {
//       const candidateId = votes[post];
//       if (candidateId) {
//         const tx = await contract.vote(post, candidateId);
//         await tx.wait();
//         console.log(`✅ Voted for ${post}: Candidate ${candidateId}`);
//       }
//     }

//     alert("✅ Your vote has been recorded on the blockchain.");
//   } catch (err) {
//     console.error("❌ Voting failed:", err);
//     alert("❌ Voting failed. Check console for details.");
//   }
// };

//   if (loading) return <p>Loading voting interface...</p>;
//   // if (isAdmin) return <p className="error-msg">❌ Admin cannot participate in voting.</p>;
//   return (
//     <div className="vote-box">
//       {isReview ? (
//         <>
//           <h1 className="post-title">Review your choices</h1>
//           <ul className="review-list">
//             {posts.map(post => {
//               const candId = votes[post];
//               const cand = candidatesMap[post]?.find(c => c.id === candId);
//               return (
//                 <li key={post}>
//                   <strong>{post}:</strong> {cand ? `${cand.name} ${cand.symbol}` : "Not selected"}
//                 </li>
//               );
//             })}
//           </ul>
//         </>
//       ) : (
//         <>
//           <h1 className="post-title">{posts[current]}</h1>
//           <h2 className="subheading">Select your candidate</h2>
//           <form className="candidate-list">
//             {candidatesMap[posts[current]]?.map(c => (
//               <label key={c.id} className="radio-option">
//                 <span className="candidate-name">{c.name}</span>
//                 <span className="candidate-symbol">{c.symbol}</span>
//                 {/* <input
//                   type="radio"
//                   name={posts[current]}
//                   value={c.id}
//                   checked={votes[posts[current]] === c.id}
//                   onChange={() => handleVote(posts[current], c.id)}
//                   className="vote-radio"
//                 /> */}
//                 <input
//                 type="radio"
//                 name={posts[current]}
//                 value={c.id}
//                 checked={votes[posts[current]] === c.id}
//                 onChange={() => handleVote(posts[current], c.id)}
//                 className="vote-radio"
//                 disabled={isAdmin}
//                  />

//               </label>
//             ))}
//           </form>
//         </>
//       )}

//       <div className="carousel-controls">
//         <button className="change__btn change__btn--left" onClick={prev} disabled={current === 0 && !isReview}>
//           &larr;
//         </button>
//         <button className="change__btn change__btn--right" onClick={next} disabled={isReview}>
//           &rarr;
//         </button>
//       </div>

//       {!isReview && (
//         <div className="dots">
//           {posts.map((_, i) => (
//             <span key={i} className={`dot ${i === current ? "active" : ""}`} />
//           ))}
//         </div>
//       )}

//       {/* {isReview && (
//         <button className="submit-btn" onClick={handleSubmit}>
//           Submit Vote
//         </button>
//       )} */}
//       {isReview && !isAdmin && (
//   <button className="submit-btn" onClick={handleSubmit}>
//     Submit Vote
//   </button>
// )}

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
  const [current, setCurrent] = useState(0);
  const [isReview, setIsReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation(); // 👈 React Router hook to track path changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ensure loading state is triggered

        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, VotingABI.abi, provider);

        const positions = await contract.getPositions();
        const map = {};

        for (const pos of positions) {
          const count = await contract.getCandidateCount(pos);
          const candidates = [];
          for (let i = 1; i <= count; i++) {
            const [name] = await contract.getCandidate(pos, i);
            candidates.push({ id: i, name, symbol: "⭐" });
          }
          map[pos] = candidates;
        }

        setPosts(positions);
        setCandidatesMap(map);
        setLoading(false);

        // Check admin status
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const ownerAddress = await contract.owner();

        setIsAdmin(userAddress.toLowerCase() === ownerAddress.toLowerCase());
      } catch (err) {
        console.error("❌ Failed to fetch voting data:", err);
        alert("❌ Failed to load candidates from blockchain.");
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]); // 👈 Re-fetch whenever you navigate to this page

  const handleVote = (post, candidateId) => {
    if (isAdmin) return;
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
    } catch (err) {
      console.error("❌ Voting failed:", err);
      alert("❌ Voting failed. Check console for details.");
    }
  };

  if (loading) return <p>Loading voting interface...</p>;

  if (!loading && posts.length === 0) {
    return (
      <div className="vote-box">
        <h2>No candidates have been added yet.</h2>
      </div>
    );
  }

  return (
    <div className="vote-box">
      {isReview ? (
        <>
          <h1 className="post-title">Review your choices</h1>
          <ul className="review-list">
            {posts.map(post => {
              const candId = votes[post];
              const cand = candidatesMap[post]?.find(c => c.id === candId);
              return (
                <li key={post}>
                  <strong>{post}:</strong> {cand ? `${cand.name} ${cand.symbol}` : "Not selected"}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <h1 className="post-title">{posts[current]}</h1>
          <h2 className="subheading">Select your candidate</h2>
          <form className="candidate-list">
            {candidatesMap[posts[current]]?.map(c => (
              <label key={c.id} className="radio-option">
                <span className="candidate-name">{c.name}</span>
                <span className="candidate-symbol">{c.symbol}</span>
                <input
                  type="radio"
                  name={posts[current]}
                  value={c.id}
                  checked={votes[posts[current]] === c.id}
                  onChange={() => handleVote(posts[current], c.id)}
                  className="vote-radio"
                  disabled={isAdmin}
                />
              </label>
            ))}
          </form>
        </>
      )}

      {posts.length > 0 && (
        <>
          <div className="carousel-controls">
            <button className="change__btn change__btn--left" onClick={prev} disabled={current === 0 && !isReview}>
              &larr;
            </button>
            <button className="change__btn change__btn--right" onClick={next} disabled={isReview}>
              &rarr;
            </button>
          </div>

          {!isReview && (
            <div className="dots">
              {posts.map((_, i) => (
                <span key={i} className={`dot ${i === current ? "active" : ""}`} />
              ))}
            </div>
          )}

          {isReview && !isAdmin && (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Vote
            </button>
          )}
        </>
      )}
    </div>
  );
}
