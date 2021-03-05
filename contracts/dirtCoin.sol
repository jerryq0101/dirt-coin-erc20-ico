pragma solidity ^0.4.22;

contract dirtCoin {

  //name
  string public name = "dirtCoin";
  //symbpl
  string public symbol = "DTC";
  //standard
  string public standard = "dirtCoin v0.1";
  uint256 public totalSupply;

  event Transfer (
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  //transfer

// approve event
  event Approval (
    address indexed _owner, // owner of tokens
    address indexed _spender, // spender gets access to allowance
    uint256 _value // allownace amount
  );

  // mapping - admin which address has token
  mapping(address => uint256) public balanceOf;


  //allowance
  mapping(address => mapping(address => uint256)) public allowance;
  // account1 approves account2 to spend uint256 amount of tokens


  // constructor

  function dirtCoin(uint256 _initialSupply) public {
    // writing initialsupply of the first ganache account to its balance
    balanceOf[msg.sender] = _initialSupply;
    //allocate the initial supply
    totalSupply = _initialSupply;
  }

  // Transfer Function


  function transfer(address _to, uint256 _value) public returns (bool success) {
    // exception if acc does not have enough

    require(balanceOf[msg.sender] >= _value);
      // require - if function evaluates true continue the function
      // ^ requiring the balance of the sender to be bigger than value sending

    // Transfer the balance
    balanceOf[msg.sender]-= _value;
    balanceOf[_to] += _value;

    // transfer event
    Transfer(msg.sender, _to, _value);

    // return a boolean if everything went as planned
    return true;
  }

  // delegated Transfer

  //approve
  function approve(address _spender, uint256 _value) public returns (bool success) {

    //allowance
    allowance[msg.sender][_spender] = _value;
    // approve event trigger
    Approval(msg.sender, _spender, _value);

    return true;
  }



  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){

    // require _from has enough token
    require(_value <= balanceOf[_from]);

    // require allowance is big enough than the transfer value: _value
    require(_value <= allowance[_from][msg.sender]);

    // transfer bal
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    // update allowance
    allowance[_from][msg.sender] -= _value;

    // call transfer event
    Transfer(_from, _to, _value);

    //return boolean
    return true;
  }











}
