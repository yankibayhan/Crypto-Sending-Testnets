
pragma solidity ^0.7;

contract MyContract {
  uint public data;

  function setData(uint _data) external {
    data = _data;
  }
}