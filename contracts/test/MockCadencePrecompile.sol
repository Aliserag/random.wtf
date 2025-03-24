// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockCadencePrecompile {
    bytes32 private mockRandomValue;
    
    constructor(uint256 value) {
        mockRandomValue = bytes32(value);
    }
    
    function revertibleRandom() external view returns (bytes32) {
        return mockRandomValue;
    }
    
    // Allow changing the mock value for different test cases
    function setMockRandomValue(uint256 value) external {
        mockRandomValue = bytes32(value);
    }
} 