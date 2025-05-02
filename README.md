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

import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";

function App() {
  const [storedPrice, setStoredPrice] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contractAddress = "REPLACE_WITH_DEPLOYED_CONTRACT_ADDRESS";
  const ABI = [
    {
      "inputs": [],
      "name": "getLatestPrice",
      "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storeLatestPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storedPrice",
      "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const contract = new ethers.Contract(contractAddress, ABI, signer);

  const getStoredPrice = async () => {
    try {
      const price = await contract.storedPrice();
      setStoredPrice(parseInt(price) / 100000000);
    } catch (error) {
      console.error("getStoredPrice Error:", error);
    }
  };

  async function updateNewPrice() {
    try {
      const tx = await contract.storeLatestPrice();
      await tx.wait();
      await getStoredPrice();
    } catch (error) {
      console.error("updateNewPrice Error:", error);
    }
  }

  useEffect(() => {
    getStoredPrice();
  }, []);

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col">
          <h3>Stored Price</h3>
          <p>Stored ETH/USD Price: {storedPrice}</p>
        </div>
        <div className="col">
          <h3>Update Price</h3>
          <button className="btn btn-dark" onClick={updateNewPrice}>Update</button>
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
