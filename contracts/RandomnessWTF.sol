// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {CadenceRandomConsumer} from "@onflow/flow-sol-utils/src/random/CadenceRandomConsumer.sol";

contract RandomnessWTF is CadenceRandomConsumer {

    event RandomNumberGenerated(uint64 randomNumber, uint64 min, uint64 max);
    event RandomItemSelected(string item, uint256 index);

    error EmptyItemArray();

    function getRandomNumber(uint64 min, uint64 max) public view returns (uint64) {
        return _getRevertibleRandomInRange(min, max);
    }
    
    function selectRandomItem(string[] calldata items) public view returns (string memory) {
        if (items.length == 0) {
            revert EmptyItemArray();
        }
        
        uint64 randomIndex = getRandomNumber(0, uint64(items.length - 1));
        return items[randomIndex];
    }
}