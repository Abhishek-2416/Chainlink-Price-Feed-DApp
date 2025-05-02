# Chainlink Price Feed dApp

A decentralized application (dApp) that fetches and stores the latest Ethereum (ETH) price using Chainlink Data Feeds.  
Users can interact with the smart contract through a React frontend.

---

## 🏗 Project Structure

- **Backend**: Solidity smart contract deployed using Foundry on Avalanche Fuji Testnet
- **Frontend**: React.js app using Ethers.js to interact with the smart contract

---

## 🚀 Getting Started

### Backend Setup (Smart Contract)

#### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Create Project Structure
```
mkdir chainlink-dapp-example
cd chainlink-dapp-example
mkdir backend
cd backend
forge init
```

3. Install Chainlink Contracts
```
forge install smartcontractkit/chainlink-brownie-contracts
```

4. Remove Default Example Files
```
rm src/Counter.sol
rm script/Counter.s.sol
rm test/Counter.t.sol
```

5. Create the Smart Contract

Create src/PriceConsumerV3.sol:

```

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface public priceFeed;
    int public storedPrice;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getDecimals() public view returns (uint8) {
        return priceFeed.decimals();
    }

    function getLatestPrice() public view returns (int) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function getLatestStoredPrice() external returns (int) {
        storedPrice = getLatestPrice();
        return storedPrice;
    }
}

```

6. Update foundry.toml

```
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@chainlink=lib/chainlink-brownie-contracts"]
dotenv = ".env"

```

7. Create .env file
```
FUJI_RPC_URL=https://avax-fuji.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
```

8. Create Deployment Script
```
Create script/DeployPriceConsumer.s.sol:

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {PriceConsumerV3} from "../src/PriceConsumerV3.sol";

contract DeployPriceConsumerV3 is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        new PriceConsumerV3(0x694AA1769357215DE4FAC081bf1f309aDC325306); // Avalanche Fuji ETH/USD Price Feed address
        vm.stopBroadcast();
    }
}
```
9. Compile and Deploy
```
forge compile
source .env
forge script script/DeployPriceConsumer.s.sol --broadcast
```

Frontend Setup (React App)
1. Create React App
```
### Frontend Setup (React App)

cd ..

# Using npm
npx create-react-app frontend

# Or using Yarn
yarn create react-app frontend

cd frontend
```

2. Clean Up Default Files

Delete the following files:
src/App.test.js
src/setupTests.js
src/reportWebVitals.js
src/logo.svg
src/App.css

3. Install Required Packages
```
# Using npm
npm install bootstrap ethers@5.7.2 

# Or with Yarn:
yarn add bootstrap ethers@5.7.2

```
4. Set Up App.js
```
Replace contents of src/App.js:

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
 provider.send("eth_requestAccounts",[]);
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
```
5. Run the Frontend
```
# Using npm
npm run start

# Or using Yarn
yarn start
```
Visit http://localhost:3000 and connect MetaMask when prompted.
