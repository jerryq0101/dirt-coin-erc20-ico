App = {

  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 1000000,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 != 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("dirtCoinSale.json", function(dirtCoinSale) {
      App.contracts.dirtCoinSale = TruffleContract(dirtCoinSale);
      App.contracts.dirtCoinSale.setProvider(App.web3Provider);
      App.contracts.dirtCoinSale.deployed().then(function(dirtCoinSale) {
        console.log("dirtCoin Sale Address:", dirtCoinSale.address);
      });
    }).done(function() {
      $.getJSON("dirtCoin.json", function(dirtCoin) {
        App.contracts.dirtCoin = TruffleContract(dirtCoin);
        App.contracts.dirtCoin.setProvider(App.web3Provider);
        App.contracts.dirtCoin.deployed().then(function(dirtCoin) {
          console.log("dirtCoin Address:", dirtCoin.address);
        });
        App.listenForEvents();

        return App.render();
      });
    })
  },

  //listens for events from contract

  listenForEvents : function() {
    App.contracts.dirtCoinSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock : 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

  render: function() {

    if (App.loading) {
      return;
    }
    App.loading = true;

    const loader = $('#loader');
    const content = $('#content');

    loader.show();
    content.hide();



    // Load account data
    web3.eth.getCoinbase((err, res) => {
      if (err === null) {
        App.account = res;
        $("#accountAddress").html("Your account: " + res);
        console.log(App.account);
      }
    });

    // load token sale contract
    App.contracts.dirtCoinSale.deployed().then(function(instance) {
      dirtCoinSaleInstance = instance;
      return dirtCoinSaleInstance.tokenPrice();
    }).then(function(tokenPrice) {
      console.log("tokenPrice:", tokenPrice);
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return dirtCoinSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      const progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');


      // load token contract

      App.contracts.dirtCoin.deployed().then(function(instance) {
        dirtCoinInstance = instance;
        return dirtCoinInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.dirt-balance').html(balance.toNumber());


        App.loading = false;
        loader.hide();
        content.show();
      })
    });




 },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.dirtCoinSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from : App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000
      });
    }).then(function(result) {
      console.log("Tokens bought")
      $('form').trigger('reset')

      // wait for sell event

    })
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
