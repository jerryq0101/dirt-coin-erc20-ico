const dirtCoin = artifacts.require("./dirtCoin.sol");
const dirtCoinSale = artifacts.require("./dirtCoinSale.sol");

module.exports = function(deployer) {
  deployer.deploy(dirtCoin, 4000000).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(dirtCoinSale, dirtCoin.address, tokenPrice);
  });
};