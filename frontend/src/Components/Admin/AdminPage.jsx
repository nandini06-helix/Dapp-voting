import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { useNavigate } from "react-router-dom";
import VotingABI from "../../abi/Voting.json";
import "./AdminPage.css";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const predefinedPositions = ["President", "Vice President", "Secretary", "Treasurer"];

export default function AdminPage() {
  const [form, setForm] = useState({
    name: "", position: "", agenda: "", image: null, imagePreview: null
  });
  const [times, setTimes] = useState({ start: "", end: "" });
  const [onChainTimes, setOnChainTimes] = useState({ start: null, end: null });
  const [votingStarted, setVotingStarted] = useState(false);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, VotingABI.abi, provider);

        const start = await contract.votingStartTime();
        const end = await contract.votingEndTime();
        const started = await contract.votingStarted();

        setOnChainTimes({ start: Number(start), end: Number(end) });
        setVotingStarted(started);
      } catch (err) {
        console.error("❌ Failed to fetch voting info:", err);
      }
    };
    fetchData();
  }, []);
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const onCandidateSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.position) return alert("Name & Position required.");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, VotingABI.abi, signer);

      const tx = await contract.addCandidate(form.position, form.name);
      await tx.wait();

      window.scrollTo({ top: 0, behavior: "smooth" });
      alert("Candidate added!");
      setForm({ name: "", position: "", agenda: "", image: null, imagePreview: null });
    } catch (err) {
      console.error("Error adding candidate:", err);
      alert("Failed to add candidate. Please try again.");
    }
  };

  const onTimeSubmit = async (e) => {
    e.preventDefault();
    if (!times.start || !times.end) return alert("Start and End required.");

    const s = Math.floor(new Date(times.start).getTime() / 1000);
    const eT = Math.floor(new Date(times.end).getTime() / 1000);

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, VotingABI.abi, signer);

    const tx = await contract.setVotingPeriod(s, eT);
    await tx.wait();

    alert("Voting period set!");
    setOnChainTimes({ start: s, end: eT });
    setTimes({ start: "", end: "" });
  };

  const handleStartVoting = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, VotingABI.abi, signer);

      const tx = await contract.startVoting();
      await tx.wait();
      alert("✅ Voting started!");
      setVotingStarted(true); // ✅ update local state
    } catch (err) {
      console.error("❌ Failed to start voting:", err);
      alert("Failed to start voting.");
    }
  };

  const handleEndVoting = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, VotingABI.abi, signer);

      const tx = await contract.endVoting();
      await tx.wait();
      alert("✅ Voting ended and results declared!");
    } catch (err) {
      console.error("❌ Failed to end voting:", err);
      alert("Failed to end voting.");
    }
  };

  const votingHasEnded = onChainTimes.end && now >= onChainTimes.end;

  return (
    <div className="admin-page" style={{ marginTop: "200px" }}>
      <h2>Add Candidate</h2>
      <form onSubmit={onCandidateSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <select
          value={form.position}
          onChange={e => setForm(prev => ({ ...prev, position: e.target.value }))}
          required
        >
          <option value="">-- Select Position --</option>
          {predefinedPositions.map((pos, idx) => (
            <option key={idx} value={pos}>{pos}</option>
          ))}
        </select>
        <textarea
          rows="4"
          placeholder="Agenda"
          value={form.agenda}
          onChange={e => setForm(prev => ({ ...prev, agenda: e.target.value }))}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        {form.imagePreview && <img src={form.imagePreview} alt="Preview" style={{ width: "120px" }} />}
        <button type="submit">Add Candidate</button>
      </form>

      <hr />

      <h2>Set Election Period</h2>
      <form onSubmit={onTimeSubmit}>
        <label>
          Start:
          <input
            type="datetime-local"
            value={times.start}
            onChange={e => setTimes(prev => ({ ...prev, start: e.target.value }))}
            required
          />
        </label>
        <label>
          End:
          <input
            type="datetime-local"
            value={times.end}
            onChange={e => setTimes(prev => ({ ...prev, end: e.target.value }))}
            required
          />
        </label>
        <button type="submit">Set Period</button>
      </form>

      <hr />

      <h2>Voting Controls</h2>
      <button
        onClick={handleStartVoting}
        disabled={votingStarted || now < onChainTimes.start} style={{ marginTop: 20  ,margin:"5px 5px"}}
      >
        Start Voting
      </button>
      <button
        onClick={handleEndVoting}
        disabled={!votingHasEnded} style={{ marginTop: 20  ,margin:"5px 5px"}}
      >
        End Voting
      </button>

      <button onClick={() => navigate("/dashboard")} style={{ marginTop: 20  ,margin:"5px 5px"}}>
        Back to Dashboard
      </button>
    </div>
  );
}

