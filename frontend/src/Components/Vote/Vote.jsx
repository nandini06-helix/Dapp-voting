import React, { useState } from "react";
import "./vote.css";

const posts = ["GS Secretary", "GS Sports", "GS Cultural"];
const contestants = [
  { id: 1, name: "Rajesh", symbol: "🔷" },
  { id: 2, name: "Ramesh", symbol: "🔶" },
  { id: 3, name: "Suresh", symbol: "⭐" },
];

export default function Vote() {
  const [current, setCurrent] = useState(0);
  const [votes, setVotes] = useState({});
  const [isReview, setIsReview] = useState(false);

  const handleVote = (post, candidateId) =>
    setVotes({ ...votes, [post]: candidateId });

  const next = () => {
    if (!votes[posts[current]]) {
      alert("Your vote is important to us. Please pick a candidate before continuing.");
      return;
    }
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

  const handleSubmit = () => {
    console.table(votes);
    alert("✅  Your vote has been submitted. Thank you!");
  };

  return (
    <div className="vote-box">
      {isReview ? (
        <>
          <h1 className="post-title">Review your choices</h1>
          <h2 className="subheading">You voted for:</h2>
          <ul className="review-list">
            {posts.map(post => {
              const candId = votes[post];
              const cand = contestants.find(c => c.id === candId);
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
            {contestants.map(c => (
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
                />
              </label>
            ))}
          </form>
        </>
      )}


      <div className="carousel-controls">
        <button
          className="change__btn change__btn--left"
          onClick={prev}
          disabled={current === 0 && !isReview}
        >
          &larr;
        </button>
        <button
          className="change__btn change__btn--right"
          onClick={next}
          disabled={isReview}
        >
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

      {isReview && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Vote
        </button>
      )}
    </div>
  );
}
