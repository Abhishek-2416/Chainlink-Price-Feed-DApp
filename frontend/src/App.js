import React, { useState } from 'react';
import { ethers } from "ethers";

function App() {
  const [storedPrice, setStoredPrice] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractAddress ="0xa795BFbDD4d47873C45929F03A74d3659ff634dB";
  const ABI = '[{"type":"constructor","inputs":[{"name":"_priceFeed","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"getDecimals","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"getLatestPrice","inputs":[],"outputs":[{"name":"","type":"int256","internalType":"int256"}],"stateMutability":"view"},{"type":"function","name":"getLatestStoredPrice","inputs":[],"outputs":[{"name":"","type":"int256","internalType":"int256"}],"stateMutability":"nonpayable"},{"type":"function","name":"priceFeed","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract AggregatorV3Interface"}],"stateMutability":"view"},{"type":"function","name":"storedPrice","inputs":[],"outputs":[{"name":"","type":"int256","internalType":"int256"}],"stateMutability":"view"}]'
  const contract = new ethers.Contract(contractAddress, ABI, signer);
  const getStoredPrice = async () => {
    try {
      const contractPrice = await contract.storedPrice();
      setStoredPrice(parseInt(contractPrice) / 100000000);
    } catch (error) {
      console.log("getStoredPrice Error: ", error);
    }
  }

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
  

  getStoredPrice()
  .catch(console.error)

  return (
    <div className="container">
      <div className="row mt-5">

        <div className="col">
          <h3>Stored Price</h3>
          <p>Stored AVAX/USD Price: {storedPrice}</p>
        </div>

        <div className="col">
          <h3>Update Price</h3>
          <button type="submit" className="btn btn-dark" 
onClick={updateNewPrice}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default App;