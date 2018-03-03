pragma solidity 0.4.18;

contract SetsAndEvents {

  bool state = false;

  function getNumber () public constant returns (uint time) {
      return 42;
  }

  function noop () public {
    state = ! state;
  }

}
