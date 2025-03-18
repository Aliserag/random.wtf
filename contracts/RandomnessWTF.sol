// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RandomnessWTF {
    // Address of the Cadence Arch contract
    address constant public cadenceArch = 0x0000000000000000000000010000000000000001;
    
    event RandomNumberGenerated(uint64 randomNumber, uint64 min, uint64 max);
    event RandomItemSelected(string item, uint256 index);

    function getRandomNumber(uint64 min, uint64 max) public view returns (uint64) {
        require(max > min, "Max must be greater than min");
        
        // Static call to the Cadence Arch contract's revertibleRandom function
        (bool ok, bytes memory data) = cadenceArch.staticcall(
            abi.encodeWithSignature("revertibleRandom()")
        );
        require(ok, "Failed to fetch a random number through Cadence Arch");
        
        uint64 randomNumber = abi.decode(data, (uint64));
        
        // Scale the random number to the desired range
        uint64 scaled = (randomNumber % (max - min + 1)) + min;
        
        return scaled;
    }
    
    function selectRandomItem(string[] calldata items) public view returns (string memory) {
        require(items.length > 0, "Items array cannot be empty");
        
        uint64 randomIndex = getRandomNumber(0, uint64(items.length - 1));
        return items[randomIndex];
    }
} 