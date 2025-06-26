
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./ConnectWallet.css"; // if you have styling
// import { ethers } from "ethers";
import { BrowserProvider, Contract } from "ethers";
import VotingABI from "../../abi/Voting.json";


const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
// Replace with your contract address
const ConnectWallet = () => {
  const navigate = useNavigate();

  const connectWallet = async () => {
  console.log("Connect Wallet button clicked");

  if (!window.ethereum) {
    alert("MetaMask not detected. Please install it.");
    window.open("https://metamask.io/download/", "_blank");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.length > 0) {
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const contract = new ethers.Contract(contractAddress, VotingABI.abi, provider);
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, VotingABI.abi, provider);

      const owner = await contract.owner(); // ✅ correct
      // const owner = await contract.getOwner(); // ✅ Correct


      const isAdmin = owner.toLowerCase() === accounts[0].toLowerCase();

      sessionStorage.setItem("walletAddress", accounts[0]);
      sessionStorage.setItem("role", isAdmin ? "admin" : "voter");

      console.log("Connected wallet:", accounts[0], "as", isAdmin ? "Admin" : "Voter");
      navigate("/dashboard");
    }
  } catch (error) {
    console.error("MetaMask connection error:", error);
    alert("Connection cancelled or failed.");
  }
};

  useEffect(() => {
    // Clear wallet & auth info on tab close
    const handleUnload = () => {
      sessionStorage.removeItem("walletAddress");
      sessionStorage.removeItem("authToken");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="connect-wallet-page">
      <h2>Connect Your MetaMask Wallet</h2>
      <button onClick={connectWallet} style={{
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#4caf50",
          border: "none",
          borderRadius: "5px",
        }}>
        Connect Wallet
      </button>
    </div>
  );

};

export default ConnectWallet;
