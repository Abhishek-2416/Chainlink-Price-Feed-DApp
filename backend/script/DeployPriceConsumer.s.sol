// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {PriceConsumerV3} from "../src/PriceConsumerV3.sol";

contract DeployPriceConsumerV3 is Script{
    function run() external{
        string memory sepoliaRpcURL = vm.envString("SEPOLIA_RPC_URL");
        string memory fujiRpcURL = vm.envString("FUJI_RPC_URL");
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.createSelectFork(sepoliaRpcURL);

        vm.startBroadcast(privateKey);
        //new PriceConsumerV3(0x694AA1769357215DE4FAC081bf1f309aDC325306); //Sepolia ETH/USD price Feed Address
        new PriceConsumerV3(0x5498BB86BC934c8D34FDA08E81D444153d0D06aD); //Fuji AVAX/USD price Feed Address
        vm.stopBroadcast();   
    }
}