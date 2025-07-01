import React, { useState, useContext } from "react";
import "./vote.css";
import { ThemeContext } from "../../App"; // Adjust path if needed

const posts = ["GS Secretary", "GS Sports", "GS Cultural"];
const contestants = [
  { id: 1, name: "Rajesh" },
  { id: 2, name: "Ramesh" },
  { id: 3, name: "Suresh" },
];

export default function Vote() {
  const { theme } = useContext(ThemeContext);
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
    alert("✅ Your vote has been submitted. Thank you!");
  };

  return (
    <div className={`vote-wrapper ${theme}`}>
      <div className="vote-box">
        <h1 className="post-title">
          {isReview ? "Review your choices" : posts[current]}
        </h1>
        <h2 className="subheading">
          {isReview ? "You voted for:" : "Select your candidate"}
        </h2>

        {!isReview ? (
          <form className="candidate-list">
            {contestants.map((c) => (
              <label key={c.id} className="radio-option">
                <input
                  type="radio"
                  name={posts[current]}
                  value={c.id}
                  checked={votes[posts[current]] === c.id}
                  onChange={() => handleVote(posts[current], c.id)}
                  className="vote-radio"
                />
                <span className="candidate-name">{c.name}</span>
              </label>
            ))}
          </form>
        ) : (
          <ul className="review-list">
            {posts.map((post) => {
              const candId = votes[post];
              const cand = contestants.find((c) => c.id === candId);
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
            <button onClick={handleSubmit} className="submit-btn">
              Submit Vote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
