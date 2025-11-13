// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SnapshotRegistry is Ownable {
    mapping(bytes32 => bytes32) private _snapshots;

    event SnapshotStored(address indexed sender, bytes32 indexed label, bytes32 hash);

    constructor() Ownable(msg.sender) {}

    function storeSnapshot(bytes32 label, bytes32 hash) public onlyOwner {
        require(label != 0, "Label cannot be empty");
        require(hash != 0, "Hash cannot be zero");
        _snapshots[label] = hash;
        emit SnapshotStored(msg.sender, label, hash);
    }

    function getSnapshot(bytes32 label) public view returns (bytes32) {
        return _snapshots[label];
    }

    function hashLabel(string memory label) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(label));
    }
}
