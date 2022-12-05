window.addEventListener("load", init);

var nodeType = "geth";
var accounts;
var defaultAccount;

function init() {
  // document.getElementById("retry").hidden = true;
  if (typeof web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
    console.log("Seems to be working");
    setWeb3Version();
    doGetAccounts();
  } else {
    console.log("Injected web3 Not Found!!!");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:1234'));

    // var provider = document.getElementById('provider_url').value;
    // window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
  }
}

function setWeb3Version() {
  var versionJson = {};

  // Asynchronous version
  web3.eth.getNodeInfo(function(error, result) {
    if (!error) {
      if (result.toLowerCase().includes("metamask")) {
        
        nodeType = "metamask";
      } else if (result.toLowerCase().includes("testrpc")) {
        nodeType = "testrpc";
      } else {
        nodeType = "geth";
      }
    }
  });
}


function doGetAccounts() {
  web3.eth.getAccounts(function(error, result) {
    if (error) {
      console.log("Error---->" + error);
    } else {
      accounts = result;
      console.log("accounts-count" + result.length);
      // You need to have at least 1 account to proceed
      if (result.length == 0) {
        document.getElementById("retry").hidden = false;
        alert("Unlock MetaMask and press retry");
        return;
      }
      

      var coinbase = web3.eth.coinbase;

      console.log("coinbase....." + coinbase);
      // set the default accounts
      defaultAccount = web3.eth.defaultAccount;
      console.log("default Account----- >" + defaultAccount);
      // document.getElementById("address").value = defaultAccount;
      document.getElementById("address").value = "0x229F0997B13c726ec3711911cd65c64D2d21773B";

      //postAccountAddress();
    }
  });
}

function checkEmail() {
  document.getElementById("emailverify").hidden = true;
  document.getElementById("emailerror").hidden = true;
  var emailId = document.getElementById("email").value;

  $.ajax({
    type: "POST",
    url: "http://localhost:1234/emailCheck",
    timeout: 20000,
    data: { email: emailId },
    statusCode: {
      200: function(data) {
        $("#emailverify").html("Email is verified.");
        document.getElementById("emailverify").hidden = false;
      },
      400: function(data) {
        console.log("400--->" + data.responseText);

        $("#emailerror").html("Email id already exist...Try again.");
        document.getElementById("emailerror").hidden = false;
        document.getElementById("email").value = "";
      },
      500: function(data) {
        alert("500-->" + data.responseText);
        console.log("500--->" + data.responseText);
        $("#error").html(
          "Some error occured while verifying...Internal Server Error.Click on retry button above."
        );
        document.getElementById("error").hidden = false;
        document.getElementById("retry").hidden = false;
        document.getElementById("email").value = "";
      }
    },
    success: function(data) {
      // alert("email is verified...");
    },
    error: function(data) {
      //alert("email is duplicate...");
    }
  });
}

function postAccountAddress() {
  console.log("Its in postAccountAddress");
  $.ajax({
    type: "POST",
    url: "http://localhost:1234/register",
    timeout: 20000,
    data: $("#registerForm").serialize(),
    statusCode: {
      201: function(data) {
        alert(data.message);
        console.log("201--->" + data.message);
        window.location = "http://localhost:1234/downloader.html";
      },
      400: function(data) {
        alert("400-->" + data.message);
        console.log("400--->" + data.message);
        $("#emailerror").html(
          "Email id already exist...Try with other id.Click on retry button above."
        );
        document.getElementById("emailerror").hidden = false;
        document.getElementById("retry").hidden = false;
      },
      500: function(data) {
        alert("500-->" + data.message);
        console.log("500--->" + data.message);
        $("#error").html(
          "Some error occured while registering...Internal Server Error.Click on retry button above."
        );
        document.getElementById("error").hidden = false;
        document.getElementById("retry").hidden = false;
      },
      success: function(data) {
        console.log("success");
        //$("html").html(data);
      },
      error: function(jqXHR, textStatus, err) {
        //show error message
        console.log(jqXHR);
        alert("text status " + textStatus + ", err " + err);
      }
    }
  });
}

function retryFetch() {
  location.reload(true);
}
