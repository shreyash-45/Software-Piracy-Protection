//window.addEventListener("load", init);
var contractsData = [];
var deployedContractsData = [];

var web3 = new Web3();
   if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try { 
       window.ethereum.enable().then(function() {
           // User has allowed account access to DApp...
           doGetAccounts();
       });
    } catch(e) {
       // User has denied account access to DApp...
       console.log("hgfgvjh");
    }
 }
 // Legacy DApp Browsers
 else if (window.web3) {
     web3 = new Web3(web3.currentProvider);
     console.log("raj");

 }
 // Non-DApp Browsers
 else {
     alert('You have to install MetaMask !');
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
        // document.getElementById("retry").hidden = false;
        alert("Unlock MetaMask and press refresh");
        return;
      } else fetchUndeployedContracts();
    }
  });
}

function fetchUndeployedContracts() {
  $.ajax({
    type: "POST",
    url: "http://localhost:1234/unDeployedContracts",
    timeout: 20000,
    statusCode: {
      200: function(data) {
        console.log("------undeployedContracts" + JSON.stringify(data));
        contractsData = data;
        fetchDeployedContracts();
      },
      400: function(data) {
        console.log("400--->" + data.responseText);
      },
      500: function(data) {
        alert("500-->" + data.responseText);
        console.log("500--->" + data.responseText);
      }
    },
    success: function(data) {
      console.log("Data received");
    },
    error: function(data) {}
  });
}

function fetchDeployedContracts() {
  $.ajax({
    type: "POST",
    url: "http://localhost:1234/withoutvalueContracts",
    timeout: 20000,
    statusCode: {
      200: function(data) {
        console.log("------deployedContracts" + JSON.stringify(data));
        deployedContractsData = data;
        updateContractList();
      },
      400: function(data) {
        console.log("400--->" + data.responseText);
      },
      500: function(data) {
        alert("500-->" + data.responseText);
        console.log("500--->" + data.responseText);
      }
    },
    success: function(data) {
      console.log("Data received");
    },
    error: function(data) {}
  });
}

function updateContractList() {
  var str = "<ul class='list-group'>";
  console.log(JSON.stringify("updateContractList++++++++++++" + contractsData));
  for (let i in contractsData) {
    console.log("contracts data-----" + JSON.stringify(contractsData[i]));
    str +=
      "<li class='list-group-item clearfix'>" +
      contractsData[i].email +
      `<button class='btn btn-success float-right' id='${
        contractsData[i].email
      }' onClick="deployContract('${i}')">Deploy <i class="fas fa-cloud-upload-alt"></i></button></li>`;
  }
  str += "</ul>";

  $("#list").append(str);

  var str1 = "<ul class='list-group'>";
  for (i in deployedContractsData) {
    str1 +=
      "<li class='list-group-item clearfix'>" +
      deployedContractsData[i].email +
      `<button class='btn btn-warning float-right' onClick=setContractValue('${i}')>SET DATA <i class="fas fa-edit"></i></button></li>`;
  }
  str1 += "</ul>";
  $("#setValues").append(str1);
}
// let accnt="0x229F0997B13c726ec3711911cd65c64D2d21773B";

function deployContract(index) {
  data = contractsData[index];
  console.log("Data = > ", data);
  var testerContract =new web3.eth.Contract(data.abi);
  console.log(testerContract);
  var byteCode = "0x" + data.byteCode;

  //let deploy_contract = new web3.eth.Contract(JSON.parse(abi));
  let account = '0x229F0997B13c726ec3711911cd65c64D2d21773B';


// Function Parameter
let payload = {
  data: byteCode
}

let parameter = {
  from: account,
  gasPrice:'3500000' 
}

// Function Call
testerContract.deploy(payload).send(parameter, (err, transactionHash) => {
  console.log('Transaction Hash :', transactionHash);

}).on('confirmation', () => {}).then((newContractInstance) => {
  console.log('Deployed Contract Address : ', newContractInstance.options.address);
  sendContractAddress(data.email, newContractInstance.options.address);
})


 
  //let accnt="0x229F0997B13c726ec3711911cd65c64D2d21773B";
  // var tester = testerContract.new(
  //   {
  //     from: accnt,
  //     data: byteCode,
  //     gas: "3500000"
  //   },
  //   function(e, contract) {
  //     console.log(e, contract);
  //     if (typeof contract.address !== "undefined") {
  //       console.log(
  //         "Contract mined! address: " +
  //           contract.address +
  //           " transactionHash: " +
  //           contract.transactionHash
  //       );
  //       sendContractAddress(data.email, contract.address);
  //     }
  //   }
  // );
}

function sendContractAddress(emailId, contractAdd) {
  var sendData = {
    email: emailId,
    contractAddress: contractAdd
  };
  console.log(sendData.email + "  " + sendData.contractAddress);
  $.ajax({
    type: "POST",
    url: "http://localhost:1234/contractAddress",
    timeout: 20000,
    data: sendData,
    statusCode: {
      200: function(data) {
        console.log(data);
        alert("contract deployed succesfully...");
        location.reload(true);
      },
      400: function(data) {
        console.log("400--->" + data.responseText);
      },
      500: function(data) {
        alert("500-->" + data.responseText);
        console.log("500--->" + data.responseText);
      }
    },
    success: function(data) {},
    error: function(data) {}
  });
}

function setContractValue(index) {
  data = deployedContractsData[index];
  console.log("in set value method..." + JSON.stringify(data));
  var contract = web3.eth.contract(data.abi);
  var add = data.contractAddress;
  var contractAtAddress = contract.at(add);
  var gas = 4000000;
  var value = {
    from: web3.eth.accounts[0],
    gas: gas
  };

  let count = 0;
  contractAtAddress.setSoftwareHash(data.fid, value, function(error, result) {
    if (!error) {
      console.log("result of setsoftwarehash method=" + result);
      count++;
      if (count == 2) {
        sendContractValueSetStatus(data.email);
      }
    } else console.log("error=" + error);
  });

  contractAtAddress.setHID(data.hid, value, function(error, result) {
    if (!error) {
      console.log("result of sethid method=" + result);
      count++;

      if (count == 2) {
        sendContractValueSetStatus(data.email);
      }
    } else console.log(" error=" + error);
  });
}

function sendContractValueSetStatus(emailId) {
  var sendData = {
    email: emailId
  };
  console.log(sendData.email);
  $.ajax({
    type: "POST",
    url: "http://localhost:1234/contractValuesSet",
    timeout: 20000,
    data: sendData,
    statusCode: {
      200: function(data) {
        console.log(data);
        alert(data);
        location.reload(true);
      },
      400: function(data) {
        console.log("400--->" + data.responseText);
      },
      500: function(data) {
        alert("500-->" + data.responseText);
        console.log("500--->" + data.responseText);
      }
    },
    success: function(data) {},
    error: function(data) {}
  });
}
window.ethereum.enable();

