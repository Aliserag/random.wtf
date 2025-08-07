// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RandomnessWTF v2
 * @dev Enhanced random number generator with verifiable transaction-based functions
 * @notice Uses Flow's VRF for true randomness with both view and transaction modes
 * 
 * Changelog from v1:
 * - Added verifiable transaction functions
 * - Enhanced events with full metadata
 * - Added storage for verification details
 * - Maintains backward compatibility with v1 view functions
 */

import {CadenceRandomConsumer} from "@onflow/flow-sol-utils/src/random/CadenceRandomConsumer.sol";

contract RandomnessWTF is CadenceRandomConsumer {

    struct RandomGeneration {
        uint64 result;
        uint64 min;
        uint64 max;
        address requester;
        uint256 timestamp;
        uint256 blockNumber;
    }

    struct RandomSelection {
        string result;
        string[] items;
        uint256 index;
        address requester;
        uint256 timestamp;
        uint256 blockNumber;
    }

    struct YoloDecision {
        string decision;
        string advice;
        uint64 randomValue;
        address requester;
        uint256 timestamp;
        uint256 blockNumber;
    }

    // Storage for verifiable generations
    mapping(bytes32 => RandomGeneration) public randomGenerations;
    mapping(bytes32 => RandomSelection) public randomSelections;
    mapping(bytes32 => YoloDecision) public yoloDecisions;
    
    // Generation counter for unique IDs
    uint256 public generationCount;

    // Events for backward compatibility (v1)
    event RandomNumberGenerated(uint64 randomNumber, uint64 min, uint64 max);
    event RandomItemSelected(string item, uint256 index);

    // Enhanced events for verifiable transactions (v2)
    event VerifiableRandomNumberGenerated(
        bytes32 indexed generationId,
        address indexed requester,
        uint64 randomNumber,
        uint64 min,
        uint64 max,
        uint256 blockNumber,
        uint256 timestamp
    );
    
    event VerifiableRandomItemSelected(
        bytes32 indexed selectionId,
        address indexed requester,
        string selectedItem,
        string[] items,
        uint256 index,
        uint256 blockNumber,
        uint256 timestamp
    );

    event YoloDecisionMade(
        bytes32 indexed decisionId,
        address indexed requester,
        string decision,
        string advice,
        uint64 randomValue,
        uint256 blockNumber,
        uint256 timestamp
    );

    error EmptyItemArray();

    // ====== V1 FUNCTIONS (View-only, backward compatible) ======
    
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

    // ====== V2 FUNCTIONS (Transaction-based, verifiable) ======

    function generateVerifiableRandomNumber(uint64 min, uint64 max) external returns (bytes32 generationId) {
        uint64 randomNumber = _getRevertibleRandomInRange(min, max);
        
        // Create unique ID for this generation
        generationId = keccak256(abi.encodePacked(
            msg.sender,
            block.timestamp,
            block.number,
            randomNumber,
            min,
            max,
            generationCount++
        ));

        // Store generation details
        randomGenerations[generationId] = RandomGeneration({
            result: randomNumber,
            min: min,
            max: max,
            requester: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        // Emit enhanced event
        emit VerifiableRandomNumberGenerated(
            generationId,
            msg.sender,
            randomNumber,
            min,
            max,
            block.number,
            block.timestamp
        );

        // Emit backward compatibility event
        emit RandomNumberGenerated(randomNumber, min, max);
        
        return generationId;
    }

    function generateVerifiableRandomItem(string[] calldata items) external returns (bytes32 selectionId) {
        if (items.length == 0) {
            revert EmptyItemArray();
        }

        uint64 randomIndex = _getRevertibleRandomInRange(0, uint64(items.length - 1));
        string memory selectedItem = items[randomIndex];
        
        // Create unique ID for this selection
        selectionId = keccak256(abi.encodePacked(
            msg.sender,
            block.timestamp,
            block.number,
            selectedItem,
            randomIndex,
            generationCount++
        ));

        // Store selection details
        randomSelections[selectionId] = RandomSelection({
            result: selectedItem,
            items: items,
            index: randomIndex,
            requester: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        // Emit enhanced event
        emit VerifiableRandomItemSelected(
            selectionId,
            msg.sender,
            selectedItem,
            items,
            randomIndex,
            block.number,
            block.timestamp
        );

        // Emit backward compatibility event
        emit RandomItemSelected(selectedItem, randomIndex);
        
        return selectionId;
    }

    function makeYoloDecision() external returns (bytes32 decisionId) {
        uint64 randomValue = _getRevertibleRandomInRange(1, 100);
        
        string memory decision;
        string memory advice;
        
        if (randomValue <= 50) {
            decision = "NO WAY!";
            advice = "Don't do it! Listen to your better judgment.";
        } else {
            decision = "YOLO!";
            advice = "Do it! You only live once!";
        }
        
        // Create unique ID for this decision
        decisionId = keccak256(abi.encodePacked(
            msg.sender,
            block.timestamp,
            block.number,
            decision,
            randomValue,
            generationCount++
        ));

        // Store decision details
        yoloDecisions[decisionId] = YoloDecision({
            decision: decision,
            advice: advice,
            randomValue: randomValue,
            requester: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        // Emit Yolo-specific event
        emit YoloDecisionMade(
            decisionId,
            msg.sender,
            decision,
            advice,
            randomValue,
            block.number,
            block.timestamp
        );
        
        return decisionId;
    }

    // ====== VERIFICATION FUNCTIONS ======

    function getGenerationDetails(bytes32 generationId) external view returns (RandomGeneration memory) {
        return randomGenerations[generationId];
    }

    function getSelectionDetails(bytes32 selectionId) external view returns (RandomSelection memory) {
        return randomSelections[selectionId];
    }

    function getYoloDetails(bytes32 decisionId) external view returns (YoloDecision memory) {
        return yoloDecisions[decisionId];
    }

    function verifyRandomGeneration(
        bytes32 generationId,
        address expectedRequester,
        uint64 expectedResult
    ) external view returns (bool) {
        RandomGeneration memory gen = randomGenerations[generationId];
        return gen.requester == expectedRequester && gen.result == expectedResult;
    }

    function verifyRandomSelection(
        bytes32 selectionId,
        address expectedRequester,
        string calldata expectedResult
    ) external view returns (bool) {
        RandomSelection memory sel = randomSelections[selectionId];
        return sel.requester == expectedRequester && 
               keccak256(bytes(sel.result)) == keccak256(bytes(expectedResult));
    }

    function verifyYoloDecision(
        bytes32 decisionId,
        address expectedRequester,
        string calldata expectedDecision
    ) external view returns (bool) {
        YoloDecision memory yolo = yoloDecisions[decisionId];
        return yolo.requester == expectedRequester && 
               keccak256(bytes(yolo.decision)) == keccak256(bytes(expectedDecision));
    }
}