

pragma solidity ^0.4.22;

import "./dirtCoin.sol";

contract dirtCoinSale {

  address admin;  //person who deployed contract

  dirtCoin public tokenContract; // address
  uint256 public tokenPrice; // token price
  uint256 public tokensSold;

  function dirtCoinSale(dirtCoin _tokenContract, uint256 _tokenPrice) public {

    // assign an admin
    admin = msg.sender;

    // token contract
    tokenContract = _tokenContract;

    // token price (wei)
    tokenPrice = _tokenPrice;

  }

  //Sell event

  event Sell(address _buyer, uint _amount);


  // multiply function
  function multiply(uint x, uint y) internal pure returns (uint z) {
    require( y == 0 || (z = x * y) / y == x);
  }

  // buying tokens
  function buyTokens(uint _numberOfTokens) public payable {

    // require the value is equal to tokens
    require(msg.value == multiply(_numberOfTokens, tokenPrice));

    // require contract has enough tokens
    require(tokenContract.balanceOf(this) >= _numberOfTokens);

    // require function successful
    require(tokenContract.transfer(msg.sender, _numberOfTokens));

    // keep track of number of tokens sold
    tokensSold += _numberOfTokens;

    //sell event
    Sell(msg.sender, _numberOfTokens);
      // buyer is the one who is calling the function
  }

  // ending token sale

  function endSale() public {

    // require only admin can do this
    require(msg.sender == admin);

    //trasfer remaining coins back to admin
    require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));

    // remove contract
    admin.transfer(address(this).balance);
  }








}
