// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface public priceFeed;

    int public storedPrice;

    constructor(address _priceFeed){
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getDecimals() public view returns(uint8){
        return priceFeed.decimals();
    }

    function getLatestPrice() public view returns(int){
        (,int256 price,,,) = priceFeed.latestRoundData();
        // return price / int(10 ** uint(priceFeed.decimals()));
        return price;
    }

    function getLatestStoredPrice() external returns(int){
        storedPrice = getLatestPrice();
        return storedPrice;
    }
}