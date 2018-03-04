pragma solidity 0.4.18;

contract SetsAndEvents {

  bool state = false;
  uint number = 42;

  event SomethingHappened(address indexed _from, uint _value);

  function getNumber () public constant returns (uint time) {
      return number;
  }

  function addOne() public {
    number++;
  }

  function doSomething(uint value) public {
    SomethingHappened(msg.sender, value);
  }

  function noop () public {
    state = ! state;
  }

}
