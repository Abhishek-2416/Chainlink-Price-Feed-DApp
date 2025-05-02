import React, { useState } from "react";
import { ethers } from "ethers";
 
// Custom CSS styles
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "500px",
    width: "90%",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#444",
  },
  priceDisplay: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    textAlign: "center",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  buttonWrapper: {
    textAlign: "center",
  },
};
 
function App() {
  const [storedPrice, setStoredPrice] = useState("0");
  const [account, setAccount] = useState("");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  provider.send("eth_requestAccounts", []);
  const contractAddress ="0xDEcCa2100e8f8f87d3a9925969Ef230Ad9E91Cb7";
  const ABI = '[{"type":"constructor","inputs":[{"name":"_priceFeed","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"getDecimals","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"getLatestPrice","inputs":[],"outputs":[{"name":"","type":"int256","internalType":"int256"}],"stateMutability":"view"},{"type":"function","name":"getLatestStoredPrice","inputs":[],"outputs":[{"name":"","type":"int256","internalType":"int256"}],"stateMutability":"nonpayable"},{"type":"function","name":"priceFeed","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract AggregatorV3Interface"}],"stateMutability":"view"},{"type":"function","name":"storedPrice","inputs":[],"outputs":[{"name":"","type":"int256","internalType":"int256"}],"stateMutability":"view"}]'
  const contract = new ethers.Contract(contractAddress, ABI, signer);
 
  const getStoredPrice = async () => {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
 
      // Set the first account as the current account
      setAccount(accounts[0]);
 
      const contractPrice = await contract.storedPrice();
 
      setStoredPrice(parseInt(contractPrice) / 100000000);
    } catch (error) {
      console.log("getStoredPrice Error: ", error);
    }
  };
 
  async function updateNewPrice() {
    try {
      console.log("Calling storeLatestPrice...");
      const transaction = await contract.getLatestStoredPrice();
      console.log("Transaction hash:", transaction.hash);
      await transaction.wait();
      console.log("Transaction confirmed");
      await getStoredPrice();
    } catch (error) {
      console.log("updateNewPrice Error: ", error);
      alert(error.message);
    }
  }
 
  //getStoredPrice().catch(console.error);
 
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.accountDisplay}>Connected: {account}</div>
 
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Stored Price</h3>
          <div style={styles.priceDisplay}>
            <p style={styles.price}>{storedPrice}</p>
          </div>
        </div>
 
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Update Price</h3>
          <div style={styles.buttonWrapper}>
            <button onClick={updateNewPrice} style={styles.button}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default App;