pragma solidity 0.4.18;

contract SetsAndEvents {

  bool state = false;
  uint number = 42;

  function getNumber () public constant returns (uint time) {
      return number;
  }

  function addOne() public {
    number++;
  }

  function noop () public {
    state = ! state;
  }

}
